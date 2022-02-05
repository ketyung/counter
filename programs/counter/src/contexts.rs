use anchor_lang::prelude::*;
use crate::state::Counter;
use anchor_spl::{token::{Mint,TokenAccount}};
//use std::str::FromStr;

#[derive(Accounts)]
pub struct Initialize<'info> {

    #[account(init, payer = counter_signer, space = 8 + 1 + 32 + 8 )]
    pub counter : Account<'info, Counter>,

    #[account(mut)]
    pub counter_signer : Signer<'info>,

    pub system_program : Program<'info, System>,

}


#[derive(Accounts)]
pub struct IncrementCounter<'info> {

    #[account(mut, has_one=created_by)]
    pub counter : Account<'info, Counter>,

    pub created_by : Signer<'info>,

}


#[derive(Accounts)]
pub struct GuessCountAsOdd<'info> {

    #[account(mut,has_one=created_by)]
    pub counter : Account<'info, Counter>,

    pub created_by : Signer<'info>,

}


#[derive(Accounts)]
#[instruction(mint_bump: u8)]
pub struct CreateRewardTokenEscrow<'info> {

     #[account(mut, signer)]
     pub signer: AccountInfo<'info>,

     #[account(
        init,
        seeds = [b"reward-mint-seed".as_ref()],
        bump = mint_bump,
        payer = signer,
        mint::decimals = 6,
        mint::authority = signer,
    )]
    pub reward_mint: Account<'info, Mint>,

     //#[account(address = Pubkey::from_str(REWARD_TOKEN_ACC_ADDR).unwrap())]
     
    pub reward_token_pda : Account <'info, TokenAccount>,

     pub token_program: AccountInfo<'info>,

     pub system_program: AccountInfo<'info>,

     pub rent: Sysvar<'info, Rent>,

}

