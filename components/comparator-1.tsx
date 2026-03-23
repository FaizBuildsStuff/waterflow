'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Minus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const plans = [
    { name: 'Free Tier', price: '$0', period: '/forever', cta: 'Start Free', id: 'seed' },
    { name: 'Pro Flow', price: '$9.99', period: '/month', cta: 'Start Free Trial', highlighted: true, id: 'pro' },
    { name: 'Neural Engine', price: '$12.99', period: '/month', cta: 'Contact Sales', id: 'team' },
]

const features = [
    { name: 'AI Task Decompositions', seed: '5/mo', pro: 'Unlimited', team: 'Unlimited' },
    { name: 'Workspace Syncing', seed: 'Basic', pro: 'Real-time', team: 'Priority' },
    { name: 'Daily Progress Digests', seed: 'Weekly', pro: 'Daily', team: 'Custom Frequency' },
    { name: 'Team Collaborators', seed: '1', pro: 'Up to 5', team: 'Unlimited' },
    { name: 'Cognitive Processing', seed: 'Standard', pro: 'High-speed', team: 'Dedicated' },
    { name: 'Advanced Analytics', seed: false, pro: true, team: true },
    { name: 'Custom Brand Voice', seed: false, pro: false, team: true },
    { name: 'API Access', seed: false, pro: false, team: true },
]

export default function Comparator() {
    const sectionRef = useRef(null)
    const tableRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from('.pricing-header', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            })

            // Table Rows Animation
            gsap.from('.compare-row', {
                x: -20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: tableRef.current,
                    start: 'top 80%',
                }
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="pricing-header text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Sparkles className="size-4" />
                        <span>Transparent Scalability</span>
                    </div>
                    <h2 className="text-balance font-serif text-4xl font-medium tracking-tight sm:text-5xl">
                        Deep Dive into Features
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                        Choose the level of AI-integration that matches your output velocity.
                    </p>
                </div>

                <div className="mt-16 overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm">
                    {/* Responsive Scroll Container */}
                    <div className="overflow-x-auto" ref={tableRef}>
                        <div className="min-w-[800px]">
                            {/* Table Header */}
                            <div className="grid grid-cols-4 items-end border-b">
                                <div className="p-8 text-sm font-medium text-muted-foreground">Capabilities</div>
                                {plans.map((plan) => (
                                    <div
                                        key={plan.name}
                                        className={cn(
                                            "relative p-8 text-center",
                                            plan.highlighted && "bg-primary/[0.03] before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-primary"
                                        )}
                                    >
                                        {plan.highlighted && (
                                            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-primary">
                                                Most Popular
                                            </span>
                                        )}
                                        <p className="text-lg font-bold">{plan.name}</p>
                                        <div className="mt-2">
                                            <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                                            <span className="text-muted-foreground text-sm">{plan.period}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Feature Rows */}
                            {features.map((feature, index) => (
                                <div
                                    key={feature.name}
                                    className="compare-row group grid grid-cols-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="p-5 text-sm font-medium text-foreground/80 group-hover:text-foreground">
                                        {feature.name}
                                    </div>
                                    {['seed', 'pro', 'team'].map((planKey) => {
                                        const value = feature[planKey as keyof typeof feature]
                                        return (
                                            <div
                                                key={planKey}
                                                className={cn(
                                                    "flex items-center justify-center p-5 text-sm",
                                                    planKey === 'pro' && "bg-primary/[0.02]"
                                                )}
                                            >
                                                {typeof value === 'boolean' ? (
                                                    value ? (
                                                        <div className="rounded-full bg-primary/10 p-1">
                                                            <Check className="text-primary size-4" strokeWidth={3} />
                                                        </div>
                                                    ) : (
                                                        <Minus className="text-muted-foreground/30 size-4" />
                                                    )
                                                ) : (
                                                    <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                                        {value}
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}

                            {/* Footer Buttons */}
                            <div className="grid grid-cols-4 bg-muted/20">
                                <div className="p-8"></div>
                                {plans.map((plan) => (
                                    <div
                                        key={plan.name}
                                        className={cn(
                                            "p-8",
                                            plan.highlighted && "bg-primary/[0.03]"
                                        )}
                                    >
                                        <Button
                                            asChild
                                            variant={plan.highlighted ? 'default' : 'outline'}
                                            className={cn("w-full shadow-sm", plan.highlighted && "shadow-primary/20")}
                                        >
                                            <Link href="#link">{plan.cta}</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Prices are in USD. Custom enterprise requirements? <Link href="#" className="underline hover:text-primary">Talk to our team.</Link>
                </p>
            </div>
        </section>
    )
}