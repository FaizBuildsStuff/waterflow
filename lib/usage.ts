import sql from './db';

export async function checkAiUsage(userId: number) {
  const [user] = await sql`
    SELECT subscription_tier, ai_usage_count, subscription_status, trial_ends_at 
    FROM users 
    WHERE id = ${userId}
  `;

  if (!user) return { allowed: false, error: 'User not found' };

  const isFree = user.subscription_tier === 'free';
  const trialExpired = user.trial_ends_at && new Date(user.trial_ends_at) < new Date();

  // If trial expired and on free tier, block
  if (isFree && trialExpired) {
    return { allowed: false, error: 'Trial expired. Please upgrade to continue.' };
  }

  // If free tier and usage >= 5, block
  if (isFree && user.ai_usage_count >= 5) {
    return { allowed: false, error: 'AI limit reached (5/5). Please upgrade for more.' };
  }

  return { allowed: true, tier: user.subscription_tier };
}

export async function incrementAiUsage(userId: number) {
  await sql`
    UPDATE users 
    SET ai_usage_count = ai_usage_count + 1 
    WHERE id = ${userId}
  `;
}
