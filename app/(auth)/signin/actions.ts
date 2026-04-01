'use server'

import sql from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type ActionState = {
  error?: string;
  success?: boolean;
  onboarded?: boolean;
};

export async function loginUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    // Find user
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (!user) {
      return { error: 'Account not found. Please sign up first.' };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return { error: 'Invalid password. Please try again.' };
    }

    // Sign token
    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      onboarded: user.onboarded,
      subscriptionTier: user.subscription_tier,
      subscriptionStatus: user.subscription_status,
      trialEndsAt: user.trial_ends_at ? user.trial_ends_at.toISOString() : null
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // We can't redirect directly inside an action that returns state easily in some React versions, 
    // but in Next.js 15/16 it's generally fine. However, since we're using useActionState,
    // we return a success flag and handle redirect in the client or just redirect here.
    // Let's use a success flag to be safe and handle it in the client component.
    return { success: true, onboarded: user.onboarded };

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
