
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Counter } from '../../target/types/counter';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token} from "@solana/spl-token";



export async function executeForWallet1 (counterProgram : Program<Counter>, provider : anchor.Provider, 
    rewardInfoAddress : anchor.web3.PublicKey, signer : anchor.web3.Keypair){
  
  
      console.log("execute all test for wallet 1 : ", provider.wallet.publicKey.toBase58());
     
      it("Test reverse reward authority", async () =>{
  
        //  "9Rth4pxB4dDyRUVB4sNNmubDhpAJ9RLbX1TU3BwCjXPj"
          let rewardMint = new anchor.web3.PublicKey("9Rth4pxB4dDyRUVB4sNNmubDhpAJ9RLbX1TU3BwCjXPj");
        
          let rewardTokenAcc = new anchor.web3.PublicKey("DZeVEXM9eco1MR8MXDiFGWAPPUaVbwAv8Uz6WWDpTY3Y");
          
          let rewardPdaAccount = new anchor.web3.PublicKey("4v6RaEmNVtuEHEkDarA8tJhTAoMi2cS22PFXsMiNQbk");
  
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
  
  
  export async function executeForWallet2(counterProgram : Program<Counter>, provider : anchor.Provider, 
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
  

export async function executeForWallet2Tx (counterProgram : Program<Counter>, provider : anchor.Provider, 
  counterAddress : anchor.web3.PublicKey, signer : anchor.web3.Keypair){


    it('tx some amount to wallet !!!', async () => {
      // Add your test here.

        let rewardMint = new anchor.web3.PublicKey("9Rth4pxB4dDyRUVB4sNNmubDhpAJ9RLbX1TU3BwCjXPj");
      
        console.log("rewardMint::", rewardMint.toBase58());
       
         await createAssociatedTokenAccountIfNotExist(provider, signer, provider.wallet.publicKey,rewardMint);

    });

}


export async function findAssociatedTokenAddress(walletAddress: anchor.web3.PublicKey, 
  tokenMintAddress: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> {
  return (await anchor.web3.PublicKey.findProgramAddress(
      [
          walletAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
  ))[0];
}


export async function createAssociatedTokenAccountIfNotExist(
  provider : anchor.Provider, 
  signer : anchor.web3.Keypair,
  walletAddress: anchor.web3.PublicKey, 
  tokenMintAddress: anchor.web3.PublicKey){


    const tx = new anchor.web3.Transaction();

    let tokenAccount = await findAssociatedTokenAddress(walletAddress, tokenMintAddress);

    if (!tokenAccount || await provider.connection.getAccountInfo(tokenAccount) === null ){
    

        tx.add(
          Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID,
              tokenMintAddress,tokenAccount, walletAddress, walletAddress),
    
        );

        const txSig = await provider.connection.sendTransaction(tx,[signer]);

        await provider.connection.confirmTransaction(txSig, "confirmed");

        console.log("tx :", txSig);

        console.log("successfully created ", tokenAccount.toBase58(), " for ", tokenMintAddress.toBase58());
    }
    else {

        console.log("Token account ", tokenAccount.toBase58(), " for ", tokenMintAddress.toBase58(), 
        " already exists!");
    }
    

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