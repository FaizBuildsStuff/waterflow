import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import sql from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { tier } = await req.json()
    const token = req.cookies.get('token')?.value

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Update user to simulate a successful payment
    let updateSql = sql`UPDATE users SET `
    if (tier === 'expired_trial') {
      updateSql = sql`${updateSql} subscription_tier = 'free', subscription_status = 'trialing', trial_ends_at = ${new Date(Date.now() - 1000 * 60 * 60 * 24 * 4)}` // 4 days ago
    } else {
      updateSql = sql`${updateSql} subscription_tier = ${tier}, subscription_status = 'active', trial_ends_at = NULL`
    }

    await sql`
      ${updateSql}
      WHERE id = ${payload.id}
    `

    return NextResponse.json({ success: true, message: `Simulated upgrade to ${tier}` })

  } catch (error) {
    console.error('Test upgrade error:', error)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}
