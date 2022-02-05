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
      console.log("wallet::", provider.wallet.publicKey.toBase58());
    
      let random = Math.floor(Math.random() * 200);

      const tx = await counterProgram.rpc.initialize(random, provider.wallet.publicKey,
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

      let acc = await counterProgram.account.counter.fetch(counter.publicKey);
      
      console.log("count: ", acc.count, "createdBy::", acc.createdBy.toString(), 
      "lastUpdated::", acc.lastUpdated.toString());

    });


    it('Increment counter now!!!', async () => {

    
      const tx = await counterProgram.rpc.incrementCount(
        {
            accounts : {
                counter : counter.publicKey, 
                createdBy: provider.wallet.publicKey,
            }
        }
      );
      
      console.log("Your transaction signature", tx);

      let acc = await counterProgram.account.counter.fetch(counter.publicKey);
      
      console.log("count: ", acc.count, "createdBy::", acc.createdBy.toString(), 
      "lastUpdated::", acc.lastUpdated.toString());

    });

    it('Guess counter as odd now!!!', async () => {

    
      const tx = await counterProgram.rpc.guessCountAsOdd(
        {
            accounts : {
                counter : counter.publicKey, 
                createdBy: provider.wallet.publicKey,
            }
        }
      );
      
      console.log("Your transaction signature", tx);

      let acc = await counterProgram.account.counter.fetch(counter.publicKey);
      
      console.log("count: ", acc.count, "createdBy::", acc.createdBy.toString(), 
      "lastUpdated::", acc.lastUpdated.toString());

    });


});
