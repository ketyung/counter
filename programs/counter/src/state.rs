use anchor_lang::prelude::*;
use std::str::FromStr;

#[account]
pub struct Counter {

    pub count : u8,

    pub created_by : Pubkey, 

    pub message : String,

    pub last_updated : i64, 
}


impl Counter {

    pub fn new(&mut self, init_value : u8, created_by : Pubkey  ) {

        self.count = init_value;
        self.created_by = created_by;

        self.message = String::from_str("New counter created").unwrap();

        self.last_updated = Clock::get().unwrap().unix_timestamp;

    }

    pub fn increment(&mut self) {

        if  self.count < 255 {

            self.count += 1 ;

            self.last_updated = Clock::get().unwrap().unix_timestamp;


            let mesg = format!("Counter has just been incremented, current value :{}", self.count);

            self.message = mesg;


        }

    }

    pub fn decrement(&mut self ) {

        if self.count > 0 {

            self.count -= 1; 
            self.last_updated = Clock::get().unwrap().unix_timestamp;


            let mesg = format!("Counter has just been decremented, current value :{}", self.count);

            self.message = mesg;


        }
    }

}
