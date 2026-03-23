'use client'

import { useLayoutEffect, useRef } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CreditCard, Zap, MessageSquare, ShieldCheck } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

const faqCategories = [
    {
        title: 'Platform & AI',
        icon: Zap,
        items: [
            {
                id: 'ai-1',
                question: 'How does the AI task breakdown work?',
                answer: 'Waterflow uses advanced LLMs to analyze your project goals. It identifies dependencies and splits complex objectives into actionable sub-tasks.',
            },
            {
                id: 'ai-2',
                question: 'Is my data used to train your AI models?',
                answer: 'No. Your workspace data is encrypted and processed in isolated environments; it is never used to train global models.',
            },
        ],
    },
    {
        title: 'Billing & Plans',
        icon: CreditCard,
        items: [
            {
                id: 'b-1',
                question: 'Can I switch between Pro Flow and Neural Engine?',
                answer: 'Absolutely. You can upgrade or downgrade at any time. Changes are prorated automatically.',
            },
        ],
    },
    {
        title: 'Security & Collaboration',
        icon: ShieldCheck,
        items: [
            {
                id: 's-1',
                question: 'How many team members can I invite?',
                answer: 'Seed and Pro Flow plans have fixed seats, while the Neural Engine offers unlimited seats.',
            },
        ],
    },
]

export default function FAQs() {
    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        
        const ctx = gsap.context(() => {
            // 1. Set initial state to prevent flash of unstyled content
            gsap.set('.faq-card', { opacity: 0, y: 30 })

            // 2. Animate items when they enter viewport
            gsap.to('.faq-card', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%', // Triggers when top of section hits 80% of viewport
                    toggleActions: 'play none none none', // Plays once
                }
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="bg-background py-24 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-3xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-balance font-serif text-4xl font-medium tracking-tight sm:text-5xl">
                        Common Queries
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-md text-lg">
                        Everything you need to know about navigating the Waterflow ecosystem.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqCategories.map((category) => (
                        <Card
                            key={category.title}
                            className="faq-card group relative border-muted/60 bg-card/30 p-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                            
                            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                    <category.icon className="size-4" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-foreground font-semibold tracking-wide uppercase text-[10px]">
                                    {category.title}
                                </h3>
                            </div>

                            <Accordion type="single" collapsible className="w-full px-4">
                                {category.items.map((item) => (
                                    <AccordionItem key={item.id} value={item.id} className="border-none">
                                        <AccordionTrigger className="py-4 text-left text-base font-medium transition-all hover:text-primary hover:no-underline">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed">
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Card>
                    ))}
                </div>

                {/* Footer Call to Action */}
                <div className="mt-16 flex flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-muted-foreground/30 p-10 text-center">
                    <h4 className="text-lg font-medium">Still have questions?</h4>
                    <Button asChild className="rounded-full px-8">
                        <Link href="#">
                            <MessageSquare className="mr-2 size-4" />
                            Live Chat Support
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}