use anchor_lang::prelude::*;
use crate::state::{Counter, RewardVaultInfo};
use anchor_spl::{token::{Mint,TokenAccount, SetAuthority}};
use std::str::FromStr;

#[derive(Accounts)]
pub struct Initialize<'info> {

    #[account(init, payer = counter_signer, space = 8 + 1 + 32 + 128 + 8 )]
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

const REWARD_TOKEN_ADDR : &str = "9Rth4pxB4dDyRUVB4sNNmubDhpAJ9RLbX1TU3BwCjXPj";

const REWARD_TOKEN_ACC_ADDR : &str = "DZeVEXM9eco1MR8MXDiFGWAPPUaVbwAv8Uz6WWDpTY3Y";

pub const TOKEN_REWARD_VAULT_PDA_SEED: &[u8] = b"reward_vault";

const REWARD_INFO_ACC_SIZE : usize = 8 + 32 + 1 + 32 + 32 + 32 + 8;

#[derive(Accounts)]
pub struct CreateRewardTokenEscrow<'info> {

    #[account(init, payer = signer, space = REWARD_INFO_ACC_SIZE )]
    pub reward_info : Account<'info, RewardVaultInfo>,

    #[account( address = Pubkey::from_str(REWARD_TOKEN_ADDR).unwrap())]
    pub reward_mint: Account<'info, Mint>,

    #[account(mut, address = Pubkey::from_str(REWARD_TOKEN_ACC_ADDR).unwrap())]
    pub reward_token_account :  Account <'info, TokenAccount>,

    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    pub token_program: AccountInfo<'info>,

    pub system_program: AccountInfo<'info>,

//    pub rent: Sysvar<'info, Rent>,

}


#[derive(Accounts)]
pub struct TestStoreRewardInfo<'info> {

    #[account(init, payer = signer, space = REWARD_INFO_ACC_SIZE )]
    pub reward_info : Account<'info, RewardVaultInfo>,

    // #[account( address = Pubkey::from_str(REWARD_TOKEN_ADDR).unwrap())]
    pub reward_mint: Account<'info, Mint>,

    #[account(mut)]//, address = Pubkey::from_str(REWARD_TOKEN_ACC_ADDR).unwrap())]
    pub reward_token_account :  Account <'info, TokenAccount>,

   // #[account(mut, signer)]
   // pub signer: AccountInfo<'info>,

    #[account(mut)]
    pub signer : Signer<'info>,

    pub system_program: AccountInfo<'info>,


}

impl <'info> CreateRewardTokenEscrow <'info> {

    pub fn into_set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.reward_token_account.to_account_info().clone(),
            current_authority: self.signer.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }

    /*
    pub fn into_transfer_to_pda_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self
                .reward_token_account
                .to_account_info()
                .clone(),
            to: self.reward_token_pda.to_account_info().clone(),
            authority: self.signer.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }*/
}