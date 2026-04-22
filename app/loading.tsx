'use client'

import { useEffect, useRef } from 'react'
import { Logo } from '@/components/logo'
import gsap from 'gsap'

export default function Loading() {
    const containerRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const tl = gsap.timeline({ repeat: -1 })
        
        tl.to(logoRef.current, {
            opacity: 0.5,
            scale: 0.98,
            duration: 1.5,
            ease: "power2.inOut"
        })
        .to(logoRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.inOut"
        })

        gsap.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.5,
            ease: "power3.out"
        })

        return () => {
            tl.kill()
        }
    }, [])

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background select-none"
        >
            {/* Background cinematic glow */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
            
            <div ref={logoRef} className="relative mb-8">
                <Logo className="h-12 w-auto" />
                {/* Orbital ring animation */}
                <div className="absolute inset-[-20px] rounded-full border border-white/5 animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-[-40px] rounded-full border border-white/[0.02] animate-[spin_8s_linear_infinite_reverse]" />
            </div>

            <div 
                ref={textRef}
                className="opacity-0 translate-y-4 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">
                    Initializing Engine
                </span>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <div 
                            key={i}
                            className="h-1 w-1 rounded-full bg-foreground/20 animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
