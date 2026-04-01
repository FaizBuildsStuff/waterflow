'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AlertCircle, Lock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SubscriptionGuardProps {
  children: React.ReactNode
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  // If already on billing page, don't lock
  if (pathname.includes('/dashboard/billing') || pathname.includes('/onboarding')) {
    return <>{children}</>
  }

  const isTrialing = user?.subscriptionStatus === 'trialing'
  const trialExpired = user?.trialEndsAt && new Date(user.trialEndsAt) < new Date()
  const isFree = user?.subscriptionTier === 'free'

  // Lock logic: If (trial expired AND on free tier) OR (manually locked)
  if (isFree && trialExpired) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-700">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto animate-bounce-subtle">
            <Lock size={40} />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Trial Expired</h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              Your 3-day full access has concluded. To continue architecting your vision and using AI features, please upgrade to a strategic plan.
            </p>
          </div>

          <div className="grid gap-4 pt-4">
            <Button asChild className="h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-white/5 transition-all active:scale-95">
              <Link href="/dashboard/billing">
                <Zap size={16} className="mr-2 fill-current" />
                Upgrade to Pro
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => router.push('/signin')} className="text-zinc-500 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest">
              Sign out
            </Button>
          </div>

          <div className="pt-8 flex items-center justify-center gap-6 opacity-40 grayscale">
            <div className="text-[10px] font-black uppercase tracking-widest text-white">Secure Payments via Polar.sh</div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
