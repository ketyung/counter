pub mod state;
pub mod contexts;

use anchor_lang::prelude::*;
use contexts::*;
use spl_token::instruction::AuthorityType;
use anchor_spl::token::{self};

declare_id!("GT4668DEGfKV1n6Nq5qetek6aF7op6f5mEc2vBg3ktJL");

#[program]
pub mod counter {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>,  init_value : u8, created_by : Pubkey ) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        let mesg = format!("init_value {}, the signer is {:?}", init_value, ctx.accounts.counter_signer.key());

        cntr.new (init_value, created_by);
        cntr.message = mesg ;

        Ok(())

    }


    pub fn increment_count(ctx: Context<IncrementCounter>, num_of_times_to_increment : u8 ) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        for _n in 1..num_of_times_to_increment {

            cntr.increment();
        }
       
      
        Ok(())

    }


    pub fn guess_count_as_odd(ctx: Context<GuessCountAsOdd>) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        let a = cntr.count % 2;
        let mesg = format!("is odd::{}, counter::{}, created_by :{:?}",a, cntr.count, cntr.created_by);
       
        cntr.message = mesg ;

        Ok(())

    }


    pub fn change_reward_token_authority(_ctx : Context<CreateRewardTokenEscrow>) -> ProgramResult{


        let (_pda, _bump) = Pubkey::find_program_address(&[TOKEN_REWARD_VAULT_PDA_SEED],  _ctx.program_id);

        // save the PDA info to reward info
        // which will be useful later
        let reward_info = &mut _ctx.accounts.reward_info;
        reward_info.pda = _pda; 
        reward_info.bump = _bump;
        reward_info.created_by = *_ctx.accounts.signer.key;
        reward_info.last_updated = Clock::get().unwrap().unix_timestamp;


        // set the authority to the PDA
        token::set_authority(
            _ctx.accounts.into_set_authority_context(),
            AuthorityType::AccountOwner,
            Some(_pda),
        )?;

        Ok(())
    }
}






