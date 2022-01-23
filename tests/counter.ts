import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Counter } from '../target/types/counter';

describe('counter', () => {

  let provider = anchor.Provider.env(); 
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const counterProgram = anchor.workspace.Counter as Program<Counter>;

  it('Initialize the counter!', async () => {
    // Add your test here.

    let counterSigner = anchor.web3.Keypair.generate();

    // try airdrop 0.35 sol to the counterSigner
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        counterSigner.publicKey, 0.35 * anchor.web3.LAMPORTS_PER_SOL
      ),"confirmed"
    );

    console.log("balance of counterSigner ",counterSigner.publicKey.toBase58(),  
    "::", await provider.connection.getBalance(counterSigner.publicKey));
    
    //let counterAddr = 
    //await anchor.web3.PublicKey.createWithSeed(provider.wallet.publicKey, "ctr00", program.programId);
 
    let [counterAddr,_]  = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("ctr00"))],
        counterProgram.programId,
    ); 

  
    //console.log("generated.counter.addr:", counterAddr.toBase58());

    //console.log("program.id::", counterProgram.programId.toBase58());

    const tx = await counterProgram.rpc.initialize(11,
      {
          accounts : {
              counter : counterAddr, 
              counterSigner: provider.wallet.publicKey,
              systemProgram : anchor.web3.SystemProgram.programId,
          }
          ,
          signers : [counterSigner]
      }
    );
    
    console.log("Your transaction signature", tx);
  });
});
