import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Counter } from '../target/types/counter';
import {executeForWallet1, executeForWallet2} from './utils/utils';


console.log("test .me!");

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
  else {

     console.log("None test...");
  }


});




