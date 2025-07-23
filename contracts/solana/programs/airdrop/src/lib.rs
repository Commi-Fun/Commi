use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, Transfer},
    associated_token::AssociatedToken,
};

declare_id!("11111111111111111111111111111112");

#[program]
pub mod airdrop {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        authority: Pubkey,
        min_influence_score: u64,
        reward_amount: u64,
    ) -> Result<()> {
        let airdrop_config = &mut ctx.accounts.airdrop_config;
        airdrop_config.authority = authority;
        airdrop_config.mint = ctx.accounts.reward_mint.key();
        airdrop_config.min_influence_score = min_influence_score;
        airdrop_config.reward_amount = reward_amount;
        airdrop_config.total_distributed = 0;
        airdrop_config.bump = *ctx.bumps.get("airdrop_config").unwrap();
        
        Ok(())
    }

    pub fn distribute_reward(
        ctx: Context<DistributeReward>,
        user_id: String,
        tweet_id: String,
        influence_score: u64,
    ) -> Result<()> {
        let config = &ctx.accounts.airdrop_config;
        
        // Verify minimum influence score
        require!(
            influence_score >= config.min_influence_score,
            AirdropError::InsufficientInfluence
        );

        let user_reward = &mut ctx.accounts.user_reward;
        
        // Check if user already received reward for this tweet
        require!(
            !user_reward.rewarded_tweets.iter().any(|t| t.tweet_id == tweet_id),
            AirdropError::AlreadyRewarded
        );

        // Transfer tokens to user
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.airdrop_config.to_account_info(),
        };
        
        let seeds = &[
            b"airdrop_config".as_ref(),
            &[config.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::transfer(cpi_ctx, config.reward_amount)?;

        // Update user reward record
        user_reward.user_id = user_id.clone();
        user_reward.total_rewards += config.reward_amount;
        user_reward.reward_count += 1;
        user_reward.rewarded_tweets.push(RewardedTweet {
            tweet_id: tweet_id.clone(),
            influence_score,
            reward_amount: config.reward_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        // Update global config
        let config = &mut ctx.accounts.airdrop_config;
        config.total_distributed += config.reward_amount;

        emit!(RewardDistributed {
            user_id,
            tweet_id,
            influence_score,
            reward_amount: config.reward_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        min_influence_score: Option<u64>,
        reward_amount: Option<u64>,
    ) -> Result<()> {
        let config = &mut ctx.accounts.airdrop_config;
        
        if let Some(score) = min_influence_score {
            config.min_influence_score = score;
        }
        
        if let Some(amount) = reward_amount {
            config.reward_amount = amount;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + AirdropConfig::INIT_SPACE,
        seeds = [b"airdrop_config"],
        bump
    )]
    pub airdrop_config: Account<'info, AirdropConfig>,
    
    pub reward_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = payer,
        token::mint = reward_mint,
        token::authority = airdrop_config,
        seeds = [b"vault", reward_mint.key().as_ref()],
        bump
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(user_id: String)]
pub struct DistributeReward<'info> {
    #[account(
        mut,
        seeds = [b"airdrop_config"],
        bump = airdrop_config.bump
    )]
    pub airdrop_config: Account<'info, AirdropConfig>,
    
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + UserReward::INIT_SPACE,
        seeds = [b"user_reward", user_id.as_bytes()],
        bump
    )]
    pub user_reward: Account<'info, UserReward>,
    
    #[account(
        mut,
        seeds = [b"vault", airdrop_config.mint.as_ref()],
        bump
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = airdrop_config.mint,
        associated_token::authority = user_wallet,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is the user's wallet that will receive tokens
    pub user_wallet: AccountInfo<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"airdrop_config"],
        bump = airdrop_config.bump,
        has_one = authority
    )]
    pub airdrop_config: Account<'info, AirdropConfig>,
    
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct AirdropConfig {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub min_influence_score: u64,
    pub reward_amount: u64,
    pub total_distributed: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct UserReward {
    #[max_len(50)]
    pub user_id: String,
    pub total_rewards: u64,
    pub reward_count: u32,
    #[max_len(100)]
    pub rewarded_tweets: Vec<RewardedTweet>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct RewardedTweet {
    #[max_len(50)]
    pub tweet_id: String,
    pub influence_score: u64,
    pub reward_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct RewardDistributed {
    pub user_id: String,
    pub tweet_id: String,
    pub influence_score: u64,
    pub reward_amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum AirdropError {
    #[msg("Influence score is below minimum threshold")]
    InsufficientInfluence,
    #[msg("User already rewarded for this tweet")]
    AlreadyRewarded,
    #[msg("Insufficient vault balance")]
    InsufficientBalance,
}