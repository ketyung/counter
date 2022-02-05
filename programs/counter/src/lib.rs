use anchor_lang::prelude::*;

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
    
        Ok(())

    }


    pub fn guess_count_as_odd(ctx: Context<GuessCountAsOdd>) -> ProgramResult {
        
        let cntr = &mut ctx.accounts.counter;

        let a = cntr.count % 2;
        msg!("is old::{}",a);
        assert_eq!(a, 1); 
    
        Ok(())

    }
}

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


#[account]
pub struct Counter {

    pub count : u8,

    pub created_by : Pubkey, 

    pub last_updated : i64, 
}


impl Counter {

    pub fn new(&mut self, init_value : u8, created_by : Pubkey  ) {

        self.count = init_value;
        self.created_by = created_by; 
        self.last_updated = Clock::get().unwrap().unix_timestamp;

    }

    pub fn increment(&mut self) {

        if  self.count < 255 {

            self.count += 1 ;

            self.last_updated = Clock::get().unwrap().unix_timestamp;

        }

    }

    pub fn decrement(&mut self ) {

        if self.count > 0 {

            self.count -= 1; 
            self.last_updated = Clock::get().unwrap().unix_timestamp;

        }
    }

}




