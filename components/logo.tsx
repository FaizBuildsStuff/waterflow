"use client";

import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor = true }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <LogoIcon uniColor={uniColor} />
            <span className={cn(
                "text-lg font-bold tracking-tighter transition-colors",
                uniColor ? "text-foreground" : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400"
            )}>
                Waterflow
            </span>
        </div>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            className={cn('size-6 md:size-7', className)}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Abstract Fluid Wave Icon */}
            <path
                d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50Z"
                className="opacity-10"
                fill={uniColor ? 'currentColor' : 'url(#water_gradient)'}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M50 80C66.5685 80 80 66.5685 80 50H60C60 55.5228 55.5228 60 50 60C44.4772 60 40 55.5228 40 50C40 44.4772 44.4772 40 50 40C55.5228 40 60 44.4772 60 50H80C80 33.4315 66.5685 20 50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80Z"
                fill={uniColor ? 'currentColor' : 'url(#water_gradient)'}
            />
            <circle 
                cx="50" cy="50" r="8" 
                fill={uniColor ? 'currentColor' : 'url(#water_gradient)'} 
                className="animate-pulse"
            />
            
            <defs>
                <linearGradient
                    id="water_gradient"
                    x1="20"
                    y1="20"
                    x2="80"
                    y2="80"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#2563eb" /> {/* Modern Royal Blue */}
                    <stop offset="1" stopColor="#22d3ee" /> {/* Cyan 400 */}
                </linearGradient>
            </defs>
        </svg>
    )
}