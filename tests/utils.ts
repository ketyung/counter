
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Counter } from '../target/types/counter';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token} from "@solana/spl-token";

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
