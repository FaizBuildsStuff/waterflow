'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Layout 1: Split Visual Section
export const VisualSection = ({ 
    title, 
    subtitle, 
    description, 
    image, 
    reverse = false 
}: { 
    title: string; 
    subtitle: string; 
    description: string; 
    image: string; 
    reverse?: boolean 
}) => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        
        const ctx = gsap.context(() => {
            gsap.from(contentRef.current, {
                x: reverse ? 50 : -50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            })

            gsap.from(imageRef.current, {
                scale: 1.1,
                opacity: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [reverse])

    return (
        <section ref={sectionRef} className="py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
                <div className={cn(
                    "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",
                    reverse && "lg:flex-row-reverse"
                )}>
                    {/* Content */}
                    <div ref={contentRef} className={cn("space-y-8", reverse && "lg:order-last")}>
                        <Badge variant="outline" className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500 border-indigo-500/20 bg-indigo-500/5">
                            {subtitle}
                        </Badge>
                        <h2 className="text-4xl font-serif font-medium tracking-tight text-foreground sm:text-5xl">
                            {title}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                        <div className="pt-4">
                            <Button variant="ghost" className="group h-auto p-0 font-bold hover:bg-transparent hover:text-indigo-500 transition-colors">
                                Explore Capability
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>

                    {/* Visual */}
                    <div ref={imageRef} className="relative group">
                        <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50">
                            <AspectRatio ratio={16 / 9} className="lg:aspect-square">
                                <img 
                                    src={image} 
                                    alt={title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                            </AspectRatio>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Layout 2: Animated Bento Grid
export const BentoGrid = ({ items }: { items: { title: string; description: string; span?: string }[] }) => {
    const gridRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
            gsap.from('.bento-item', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            })
        }, gridRef)
        return () => ctx.revert()
    }, [])

    return (
        <section className="py-24 bg-muted/30">
            <div className="mx-auto max-w-7xl px-6">
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                        <Card 
                            key={i}
                            className={cn(
                                "bento-item group relative overflow-hidden rounded-3xl border border-border bg-card hover:border-indigo-500/30 transition-all shadow-none",
                                item.span || ""
                            )}
                        >
                            <CardHeader className="p-8 pb-4">
                                <div className="absolute -right-4 -top-4 size-24 bg-indigo-500/5 blur-2xl rounded-full" />
                                <CardTitle className="text-xl font-bold text-foreground">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
