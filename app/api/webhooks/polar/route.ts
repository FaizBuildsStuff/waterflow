import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const payload = JSON.parse(rawBody)
    const type = payload.type

    console.log('Polar Webhook received:', type)

    // Polar subscription events
    if (type === 'subscription.created' || type === 'subscription.updated') {
      const subscription = payload.data
      const userId = subscription.metadata?.userId
      const status = subscription.status // 'active', 'canceled', etc.
      
      // Determine tier based on product ID (or name if easier)
      // For now, mapping names (User should ensure these match Polar product names)
      let tier = 'pro'
      if (subscription.product?.name?.toLowerCase().includes('neural')) {
        tier = 'neural'
      }

      if (userId) {
        await sql`
          UPDATE users 
          SET 
            subscription_tier = ${tier},
            subscription_status = ${status},
            polar_subscription_id = ${subscription.id},
            polar_customer_id = ${subscription.customer_id}
          WHERE id = ${userId}
        `
        console.log(`Updated user ${userId} to tier ${tier} with status ${status}`)
      }
    }

    if (type === 'subscription.deleted') {
      const subscription = payload.data
      const userId = subscription.metadata?.userId
      
      if (userId) {
        await sql`
          UPDATE users 
          SET 
            subscription_tier = 'free',
            subscription_status = 'expired'
          WHERE id = ${userId}
        `
        console.log(`Reverted user ${userId} to free tier due to deletion`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
