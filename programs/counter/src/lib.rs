use anchor_lang::prelude::*;

declare_id!("Ddz643soBvRW3CM7zUtNMhBRFcK5o92fTX7xgECbwvbW");

#[program]
pub mod counter_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, initial_value: i64) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value = initial_value;
        counter.owner = ctx.accounts.owner.key(); // Set the owner
        Ok(())
    }

    pub fn increment(ctx: Context<UpdateCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value += 1; // Increment the counter
        Ok(())
    }

    pub fn decrement(ctx: Context<UpdateCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value -= 1; // Decrement the counter
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = owner, space = 8 + 8 + 32)] // Space: 8 (discriminator) + 8 (value) + 32 (owner pubkey)
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub owner: Signer<'info>, // Owner who pays for the account creation
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCounter<'info> {
    #[account(mut, has_one = owner)] // Ensures only the owner can update the counter
    pub counter: Account<'info, Counter>,
    /// CHECK: This is safe because the `has_one` constraint ensures `owner` matches the owner in the `counter` account.
    #[account(signer)] // Ensures the owner must sign the transaction
    pub owner: AccountInfo<'info>, // Owner account must sign the transaction
}


#[account]
pub struct Counter {
    pub value: i64,     // Counter value
    pub owner: Pubkey,  // Owner's public key
}
