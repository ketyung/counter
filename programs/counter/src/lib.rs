pub mod state;
pub mod instructions;

use anchor_lang::prelude::*;
use instructions::*;


declare_id!("GT4668DEGfKV1n6Nq5qetek6aF7op6f5mEc2vBg3ktJL");

#[program]
pub mod counter {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, init_value : u8, created_by : Pubkey ) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        msg!("init_value {}, the signer is {:?}", init_value, ctx.accounts.counter_signer.key());

        cntr.new (init_value, created_by);

        Ok(())

    }


    pub fn increment_count(ctx: Context<IncrementCounter>) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        cntr.increment();

        msg!("current.count ::{}", cntr.count);
    
        Ok(())

    }


    pub fn guess_count_as_odd(ctx: Context<GuessCountAsOdd>) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        let a = cntr.count % 2;
        msg!("is odd::{}, counter::{}, created_by :{:?}",a, cntr.count, cntr.created_by);
       
        Ok(())

    }
}






