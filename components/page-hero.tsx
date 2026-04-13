import React from 'react'
import { cn } from '@/lib/utils'

interface PageHeroProps {
    title: string;
    subtitle: string;
    description: string;
    className?: string;
}

export const PageHero = ({ title, subtitle, description, className }: PageHeroProps) => {
    return (
        <section className={cn("relative pt-40 pb-20 overflow-hidden", className)}>
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-indigo-500/10 to-purple-600/10 blur-[120px] rounded-full" />
            </div>
            <div className="mx-auto max-w-5xl px-6 text-center">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">{subtitle}</span>
                <h1 className="mt-6 text-balance font-serif text-5xl font-medium sm:text-6xl tracking-tight">
                    {title}
                </h1>
                <p className="mt-8 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>
        </section>
    )
}
