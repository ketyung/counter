pub mod state;
pub mod contexts;

use anchor_lang::prelude::*;
use contexts::*;


declare_id!("GT4668DEGfKV1n6Nq5qetek6aF7op6f5mEc2vBg3ktJL");

#[program]
pub mod counter {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>,  init_value : u8, created_by : Pubkey ) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        msg!("init_value {}, the signer is {:?}", init_value, ctx.accounts.counter_signer.key());

        cntr.new (init_value, created_by);

        Ok(())

    }


    pub fn increment_count(ctx: Context<IncrementCounter>, num_of_times_to_increment : u8 ) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        for _n in 1..num_of_times_to_increment {

            cntr.increment();
        }
       
        msg!("current.count ::{}", cntr.count);
    
        Ok(())

    }


    pub fn guess_count_as_odd(ctx: Context<GuessCountAsOdd>) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        let a = cntr.count % 2;
        let mesg = format!("is odd::{}, counter::{}, created_by :{:?}",a, cntr.count, cntr.created_by);
       
        cntr.message = mesg ;
        
        Ok(())

    }


    pub fn change_authority_of_reward_token(_ctx : Context<CreateRewardTokenEscrow>) -> ProgramResult{

       
        Ok(())
    }
}






