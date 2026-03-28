import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const POLAR_API_KEY = process.env.POLAR_API_KEY
const POLAR_ORGANIZATION_ID = process.env.POLAR_ORGANIZATION_ID

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json()
    const token = req.cookies.get('token')?.value

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // If Polar API Key is missing, we'll return a mock checkout for testing
    // In production, this would call Polar's checkout API
    if (!POLAR_API_KEY) {
      console.warn('POLAR_API_KEY is missing, returning mock checkout URL')
      return NextResponse.json({ 
        url: `https://polar.sh/mock-checkout?product_id=${productId}&customer_email=${payload.email}&user_id=${payload.id}` 
      })
    }

    // Call Polar API to create a checkout session
    const response = await fetch('https://api.polar.sh/api/v1/checkouts/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${POLAR_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_id: productId,
            success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing?success=true`,
            customer_email: payload.email,
            metadata: {
                userId: payload.id
            }
        })
    })

    if (!response.ok) {
        const errorData = await response.json()
        console.error('Polar API Error:', errorData)
        return NextResponse.json({ error: errorData.detail || 'Checkout failed' }, { status: response.status })
    }

    const data = await response.json()
    console.log('Polar Checkout Success:', data.url)
    return NextResponse.json({ url: data.url })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
