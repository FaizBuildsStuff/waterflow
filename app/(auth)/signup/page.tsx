'use client'

import { useLayoutEffect, useRef } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Sparkles, CheckCircle2, ArrowRight, Github, ChevronLeft, Lock, Mail } from 'lucide-react'
import gsap from 'gsap'

export default function SignUp() {
    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

            gsap.set([".auth-card", ".form-element", ".promo-content", ".back-nav"], { 
                opacity: 0, 
                y: 20 
            })

            tl.to(".auth-card", {
                x: 0,
                y: 0,
                opacity: 1,
                duration: 1.2,
                delay: 0.1
            })
            .to(".form-element", {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.8
            }, "-=0.8")
            .to([".promo-content", ".back-nav"], {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1
            }, "-=1.2")

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <main ref={containerRef} className="bg-background flex min-h-screen overflow-hidden relative">
            
            {/* Mobile-only Back Button (Hidden on LG) */}
            <div className="back-nav absolute top-6 left-6 z-20 lg:hidden">
                <Button variant="ghost" asChild className="group text-muted-foreground hover:text-foreground p-0">
                    <Link href="/">
                        <ChevronLeft className="mr-1 size-4 transition-transform group-hover:-translate-x-1" />
                        Back
                    </Link>
                </Button>
            </div>

            {/* Left Side: Modern Promo */}
            <div className="relative hidden w-1/2 flex-col justify-between border-r bg-muted/30 p-12 lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/5 to-transparent" />
                
                <div className="relative z-10">
                    {/* Desktop Back Button (Integrated into Sidebar) */}
                    <div className="back-nav mb-12">
                        <Button variant="ghost" asChild className="group -ml-2 text-muted-foreground hover:text-foreground hover:bg-transparent">
                            <Link href="/">
                                <ChevronLeft className="mr-1 size-4 transition-transform group-hover:-translate-x-1" />
                                Back to home
                            </Link>
                        </Button>
                    </div>

                    <div className="promo-content">
                        <Logo className="h-8 w-auto" />
                        <div className="mt-16">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                <Sparkles className="size-4" />
                                <span>AI-Powered Project Management</span>
                            </div>
                            <h2 className="font-serif text-5xl font-medium leading-[1.1] tracking-tight text-foreground">
                                Build your vision, <br /> 
                                <span className="text-muted-foreground italic text-4xl">one flow at a time.</span>
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    {[
                        { title: "Autonomous Task Breakdown", desc: "Turn one line of text into a full roadmap." },
                        { title: "Real-time Collaboration", desc: "Synced workspaces for your growing team." }
                    ].map((item, i) => (
                        <div key={i} className="promo-content flex items-start gap-4">
                            <CheckCircle2 className="mt-1 size-5 text-primary shrink-0" />
                            <div>
                                <p className="font-medium text-foreground">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Sign Up Form */}
            <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
                <div className="w-full max-w-[420px]">
                    {/* Logo for mobile only */}
                    <div className="form-element mb-8 lg:hidden text-center">
                        <Logo className="mx-auto" />
                    </div>

                    <div className="form-element mb-10 text-center lg:text-left">
                        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">Create account</h1>
                        <p className="text-muted-foreground mt-3 text-lg">
                            Join <span className="text-foreground font-semibold font-serif">Waterflow</span> and start building.
                        </p>
                    </div>

                    <Card variant="outline" className="auth-card block border-border/60 bg-card/30 p-8 backdrop-blur-sm overflow-hidden shadow-xl shadow-primary/5 rounded-[2rem]">
                        <form action="" className="space-y-5">
                            <div className="form-element space-y-2.5">
                                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/40" />
                                    <Input
                                        type="email"
                                        id="email"
                                        className="h-11 pl-10 bg-background/50 focus-visible:ring-primary/20"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-element space-y-2.5">
                                <Label htmlFor="password" text-sm className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/40" />
                                    <Input
                                        type="password"
                                        id="password"
                                        className="h-11 pl-10 bg-background/50 focus-visible:ring-primary/20"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-element pt-2">
                                <Button className="group w-full h-11 text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                                    Get Started
                                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </form>

                        <div className="form-element my-8 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border/60" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 text-nowrap">Or sign up with</span>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-element">
                                <Button type="button" variant="outline" className="w-full h-11 border-border/60 hover:bg-muted/50 transition-colors">
                                    <svg className="mr-2 size-4" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.6"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C.79 9.84 0 13.01 0 16.45c0 3.44.79 6.61 2.18 9.38l3.66-2.84z" opacity="0.4"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity="0.8"/>
                                    </svg>
                                    Google
                                </Button>
                            </div>
                            <div className="form-element">
                                <Button type="button" variant="outline" className="w-full h-11 border-border/60 hover:bg-muted/50 transition-colors">
                                    <Github className="mr-2 size-4" />
                                    GitHub
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <p className="form-element mt-10 text-center text-sm text-zinc-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}