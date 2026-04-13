"use client";

import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export const Logo = ({ className, uniColor = true, isScrolled = false }: { className?: string; uniColor?: boolean; isScrolled?: boolean }) => {
    const nthryRef = useRef<HTMLSpanElement>(null)
    const eRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (isScrolled) {
            gsap.to(nthryRef.current, { 
                width: 0, 
                opacity: 0, 
                marginRight: 0,
                duration: 0.4, 
                ease: "power2.inOut" 
            })
            gsap.to(eRef.current, { 
                width: 0, 
                opacity: 0, 
                duration: 0.4, 
                ease: "power2.inOut" 
            })
        } else {
            gsap.to(nthryRef.current, { 
                width: "auto", 
                opacity: 1, 
                marginRight: "0.1em",
                duration: 0.5, 
                ease: "power2.out" 
            })
            gsap.to(eRef.current, { 
                width: "auto", 
                opacity: 1, 
                duration: 0.5, 
                ease: "power2.out" 
            })
        }
    }, [isScrolled])

    return (
        <div className={cn("flex items-center", className)}>
            <div className={cn(
                "flex items-center text-lg font-bold tracking-tighter transition-colors select-none",
                uniColor ? "text-foreground" : "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
            )}>
                <span>A</span>
                <span 
                    ref={nthryRef}
                    className="flex overflow-hidden whitespace-nowrap"
                >
                    NTHRY
                </span>
                <span>/</span>
                <span 
                    ref={eRef}
                    className="flex overflow-hidden whitespace-nowrap"
                >
                    E
                </span>
            </div>
        </div>
    )
}