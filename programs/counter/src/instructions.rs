use anchor_lang::prelude::*;
use crate::state::Counter;
use anchor_spl::{token::{Mint,TokenAccount}};
use std::str::FromStr;

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

const REWARD_TOKEN_MINT_ADDR : &str = "9Rth4pxB4dDyRUVB4sNNmubDhpAJ9RLbX1TU3BwCjXPj";

const REWARD_TOKEN_ACC_ADDR : &str = "DZeVEXM9eco1MR8MXDiFGWAPPUaVbwAv8Uz6WWDpTY3Y";


#[derive(Accounts)]
pub struct CreateRewardTokenEscrow<'info> {

     #[account(mut, signer)]
     pub owner: AccountInfo<'info>,

     #[account(address = Pubkey::from_str(REWARD_TOKEN_MINT_ADDR).unwrap())]
     pub reward_mint: Account<'info, Mint>,

     #[account(address = Pubkey::from_str(REWARD_TOKEN_ACC_ADDR).unwrap())]
     pub reward_token_account : Account <'info, TokenAccount>,

}

