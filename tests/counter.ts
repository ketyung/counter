import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Counter } from '../target/types/counter';
import { TOKEN_PROGRAM_ID} from "@solana/spl-token";

describe('counter', async () => {

  let provider = anchor.Provider.env(); 
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);


  const counterProgram = anchor.workspace.Counter as Program<Counter>;

 
 
  /*
  let counterAddressSeed = "counterAddress";

  const [counterAddress, _bump] = await anchor.web3.PublicKey.findProgramAddress(

    [
      Buffer.from(counterAddressSeed),

    ],

    counterProgram.programId
  );*/ 


  // let counterAddress = await anchor.web3.PublicKey.createWithSeed(counter.publicKey, 
  // counterAddressSeed, counterProgram.programId );

  // wallet 1 
  if ( provider.wallet.publicKey.toBase58() === "HYDB3uXShfH9fm8h5MaMzKVodE39AcdhkFpphXrBh9eF"){

      let rewardInfo = anchor.web3.Keypair.generate();

      let rewardInfoAddr = rewardInfo.publicKey;

      await executeForWallet1(counterProgram, provider, rewardInfoAddr, rewardInfo);

  }
  // wallet 2
  else if ( provider.wallet.publicKey.toBase58() === "B7p4ghrSKVdgvAMUTnYLyr9bVoYi8QWHZZQikSG99ZqT") {


      let counter = anchor.web3.Keypair.generate();

      let counterAddress = counter.publicKey;
    
    
      await executeForWallet2(counterProgram, provider, counterAddress, counter);

  }


});



async function executeForWallet1 (counterProgram : Program<Counter>, provider : anchor.Provider, 
  rewardInfoAddress : anchor.web3.PublicKey, signer : anchor.web3.Keypair){


    console.log("execute all test for wallet 1 : ", provider.wallet.publicKey.toBase58());
   
    it("Test store reward token info", async () =>{

      //  "9Rth4pxB4dDyRUVB4sNNmubDhpAJ9RLbX1TU3BwCjXPj"
        let rewardMint = new anchor.web3.PublicKey("9Rth4pxB4dDyRUVB4sNNmubDhpAJ9RLbX1TU3BwCjXPj");
      
        let rewardTokenAcc = new anchor.web3.PublicKey("DZeVEXM9eco1MR8MXDiFGWAPPUaVbwAv8Uz6WWDpTY3Y");
        

        const tx = await counterProgram.rpc.changeRewardTokenAuthority({

            accounts : {
                rewardInfo : rewardInfoAddress,
                rewardMint : rewardMint,
                rewardTokenAccount : rewardTokenAcc,
                signer : provider.wallet.publicKey,
                tokenProgram : TOKEN_PROGRAM_ID, 
                systemProgram : anchor.web3.SystemProgram.programId,
            },
            signers : [signer]
        });

        
        console.log("Your transaction signature", tx);

        let acc = await counterProgram.account.rewardVaultInfo.fetch(rewardInfoAddress);
        
        printRewardInfoAcc(acc);





    });

}


async function executeForWallet2(counterProgram : Program<Counter>, provider : anchor.Provider, 
  counterAddress : anchor.web3.PublicKey, signer : anchor.web3.Keypair){


    console.log("execute all test for wallet2 : ", provider.wallet.publicKey.toBase58());
    
    it('Initialize the counter now!!!', async () => {
      // Add your test here.
    
      let random = Math.floor(Math.random() * 200);

      const tx = await counterProgram.rpc.initialize(
        random, provider.wallet.publicKey,
        {
            accounts : {
                counter : counterAddress, 
                counterSigner: provider.wallet.publicKey,
                systemProgram : anchor.web3.SystemProgram.programId,
            }
            ,
            signers : [signer]
        }
      );
      
      console.log("Your transaction signature", tx);

      let acc = await counterProgram.account.counter.fetch(counterAddress);
      
      printCounterAcc(acc);

  });


  it('Increment counter now!!!', async () => {

    
      let num_of_times = Math.floor(Math.random() * 20);

      const tx = await counterProgram.rpc.incrementCount(num_of_times, 
        {
            accounts : {
                counter : counterAddress, 
                createdBy: provider.wallet.publicKey,
            }
        }
      );
      
      console.log("Your transaction signature", tx);

      let acc = await counterProgram.account.counter.fetch(counterAddress);
      
      printCounterAcc(acc);

  });

  it('Guess counter as odd now!!!', async () => {

    
      const tx = await counterProgram.rpc.guessCountAsOdd(
        {
            accounts : {
                counter : counterAddress, 
                createdBy: provider.wallet.publicKey,
            }
        }
      );
      
      console.log("Your transaction signature", tx);

      let acc  = await counterProgram.account.counter.fetch(counterAddress);
      
      printCounterAcc(acc);

  });

}



function printRewardInfoAcc (acc : any ){
  

  console.log("pda: ", acc.pda.toBase58());
  console.log("bump: ", acc.bump);
  console.log("token mint::", acc.tokenMint.toBase58());
  console.log("token account::", acc.tokenAccount.toBase58());

  console.log("createdBy::", acc.createdBy.toString());
  
  console.log("lastUpdated::", new Date( parseInt( acc.lastUpdated.toString()) * 1000)) ;

}


function printCounterAcc (acc : any ){
  
  console.log("count: ", acc.count, "createdBy::", acc.createdBy.toString(), 
  "lastUpdated::", new Date( parseInt( acc.lastUpdated.toString()) * 1000),
  
  "message:",acc.message ) ;

}

