use anchor_lang::prelude::*;

declare_id!("GT4668DEGfKV1n6Nq5qetek6aF7op6f5mEc2vBg3ktJL");

#[program]
pub mod counter {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, init_value : u8 ) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        msg!("init_value {}, the signer is {:?}", init_value, ctx.accounts.counter_signer.key());

        cntr.new (init_value);

        Ok(())

    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {

    #[account(init_if_needed, payer = counter_signer, space = 8 + 1 + 8 )]
    pub counter : Account<'info, Counter>,

    #[account(mut)]
    pub counter_signer : Signer<'info>,

    pub system_program : Program<'info, System>,

}

#[account]
pub struct Counter {

    pub count : u8,

    pub last_updated : i64, 
}


impl Counter {

    pub fn new(&mut self, init_value : u8  ) {

        self.count = init_value;
        self.last_updated = Clock::get().unwrap().unix_timestamp;

    }

    pub fn increment(&mut self) {

        if  self.count < 255 {

            self.count += 1 ;
        }

    }

    pub fn decrement(&mut self ) {

        if self.count > 0 {

            self.count -= 1; 
        }
    }

}




