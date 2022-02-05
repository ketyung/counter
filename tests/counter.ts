import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Counter } from '../target/types/counter';

describe('counter', async () => {

  let provider = anchor.Provider.env(); 
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);


  const counterProgram = anchor.workspace.Counter as Program<Counter>;

  let counter = anchor.web3.Keypair.generate();

  let counterAddressSeed = "counterAddress";

  /*
  const [counterAddress, _bump] = await anchor.web3.PublicKey.findProgramAddress(

    [
      Buffer.from(counterAddressSeed),

    ],

    counterProgram.programId
  );*/ 


  // let counterAddress = await anchor.web3.PublicKey.createWithSeed(counter.publicKey, 
  // counterAddressSeed, counterProgram.programId );


   let counterAddress = counter.publicKey;
  
 
  console.log("wallet::", provider.wallet.publicKey.toBase58(), "counter account address:",
  counterAddress.toBase58());
    

  await executeForWallet2(counterProgram, provider, counterAddress, counter);

});



async function executeForWallet2(counterProgram : Program<Counter>, provider : anchor.Provider, 
  counterAddress : anchor.web3.PublicKey, signer : anchor.web3.Keypair){


    console.log("execute all test for wallet2");
    
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



function printCounterAcc (acc : any ){
  
  console.log("count: ", acc.count, "createdBy::", acc.createdBy.toString(), 
  "lastUpdated::", new Date( parseInt( acc.lastUpdated.toString()) * 1000),
  
  "message:",acc.message ) ;

}

