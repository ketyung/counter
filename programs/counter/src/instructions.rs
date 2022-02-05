use anchor_lang::prelude::*;
use crate::state::Counter;

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
