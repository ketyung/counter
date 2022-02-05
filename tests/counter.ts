import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Counter } from '../target/types/counter';

describe('counter', () => {

  let provider = anchor.Provider.env(); 
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  let counter = anchor.web3.Keypair.generate();

  const counterProgram = anchor.workspace.Counter as Program<Counter>;

    it('Initialize the counter now!!!', async () => {
      // Add your test here.

      
    
      const tx = await counterProgram.rpc.initialize(11,
        {
            accounts : {
                counter : counter.publicKey, 
                counterSigner: provider.wallet.publicKey,
                systemProgram : anchor.web3.SystemProgram.programId,
            }
            ,
            signers : [counter]
        }
      );
      
      console.log("Your transaction signature", tx);

      let a = await provider.connection.getAccountInfo(counter.publicKey);
      console.log("a::", a.owner.toBase58());

    });


    it('Increment counter now!!!', async () => {

    
      const tx = await counterProgram.rpc.incrementCount(
        {
            accounts : {
                counter : counter.publicKey, 
                counterSigner: provider.wallet.publicKey,
            }
        }
      );
      
      console.log("Your transaction signature", tx);

      let a = await provider.connection.getAccountInfo(counter.publicKey);
      console.log("a::", a.owner.toBase58());

    });
});
