'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { ArrowLeft, Home, RefreshCcw } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".animate-up", {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power4.out"
            })
            
            gsap.to(".glow-effect", {
                opacity: 1,
                duration: 2,
                ease: "power2.inOut",
                repeat: -1,
                yoyo: true
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div 
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center bg-background px-6 overflow-hidden select-none"
        >
            {/* Background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foreground/[0.02] rounded-full blur-[120px] glow-effect opacity-0" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4))]" />
            </div>

            <div ref={contentRef} className="max-w-2xl w-full text-center space-y-12">
                <div className="space-y-4">
                    <div className="animate-up inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                        Error 404
                    </div>
                    <h1 className="animate-up text-[15vw] lg:text-[12rem] font-black leading-none tracking-tighter bg-gradient-to-b from-foreground to-foreground/20 bg-clip-text text-transparent">
                        LOST
                    </h1>
                </div>

                <div className="animate-up space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Cognitive Breakpoint Detected
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                            The destination you're seeking has been relocated or never existed in this dimension.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button 
                            asChild
                            variant="outline" 
                            className="w-full sm:w-auto h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                        >
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Return Home
                            </Link>
                        </Button>
                        <Button 
                            onClick={() => window.location.reload()}
                            className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95"
                        >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Retry Engine
                        </Button>
                    </div>
                </div>

                <div className="animate-up pt-12">
                    <Logo className="h-6 w-auto mx-auto opacity-30" />
                </div>
            </div>

            {/* Bottom watermark */}
            <div className="absolute bottom-12 left-12 hidden lg:block">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
                    <div className="h-px w-8 bg-muted-foreground/20" />
                    Anthryve Engine v2.0
                </div>
            </div>
        </div>
    )
}
