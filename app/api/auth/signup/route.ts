import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { setCookie } from 'cookies-next';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const [user] = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name || ''})
      RETURNING id, email, name, onboarded, subscription_tier, subscription_status, trial_ends_at
    `;

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

    const response = NextResponse.json({ 
      message: 'Signup successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboarded: user.onboarded
      }
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
