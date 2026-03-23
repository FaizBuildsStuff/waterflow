import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
    {
        name: 'Free Tier',
        price: '$0',
        period: '/month',
        description: 'Perfect for individuals getting started with AI productivity.',
        features: [
            '5 AI Task Decompositions',
            'Single Workspace',
            'Weekly Progress Summary',
            'Community Support',
        ],
    },
    {
        name: 'Pro Flow',
        price: '$9.99',
        period: '/month',
        description: 'For individuals architecting their personal brand.',
        features: [
            'Autonomous Task Decomposition',
            'Unlimited Workspace Sync',
            'AI Daily Sync Digests',
            'Standard Processing Speed',
        ],
    },
    {
        name: 'Neural Engine',
        price: '$12.99', // Adjusted price up to differentiate from Pro
        period: '/month',
        description: 'The full power of Waterflow for high-velocity teams.',
        features: [
            'Priority Cognitive Processing',
            'Everything in Pro Flow',
            'Advanced Team Analytics',
            'Custom Brand Voice Sync',
        ],
        highlighted: true,
        badge: 'Best Value',
    },
]

export default function Pricing() {
    return (
        <section className="bg-background @container py-24">
            {/* Increased max-width to 5xl to accommodate 3 columns comfortably */}
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance font-serif text-4xl font-medium">Elevate Your Workflow</h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
                        From solo thinkers to high-velocity teams, find the flow that fits your pace.
                    </p>
                </div>
                
                {/* Updated grid to 3 columns on larger screens */}
                <div className="@3xl:grid-cols-3 @3xl:gap-4 mt-12 grid gap-6">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            // Assuming your Card component supports these variants
                            variant={plan.highlighted ? 'default' : 'mixed'}
                            className={cn(
                                'relative flex flex-col justify-between p-6', 
                                plan.highlighted && 'ring-2 ring-primary'
                            )}>
                            
                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                                    {plan.badge}
                                </span>
                            )}

                            <div>
                                <div className="mb-6">
                                    <h3 className="text-foreground font-medium">{plan.name}</h3>
                                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{plan.description}</p>
                                </div>
                                <div>
                                    <span className="font-serif text-5xl font-medium">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>
                                <ul className="mt-6 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="text-muted-foreground flex items-start gap-2 text-sm">
                                            <Check className="text-primary mt-0.5 size-4 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                asChild
                                variant={plan.highlighted ? 'default' : 'outline'}
                                className="mt-8 w-full gap-2">
                                <Link href="#link">
                                    {plan.price === '$0' ? 'Get Started Free' : 'Upgrade Now'}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </Card>
                    ))}
                </div>
                <p className="text-muted-foreground mt-12 text-center text-sm">
                    All paid plans include a 14-day free trial. No credit card required.
                </p>
            </div>
        </section>
    )
}