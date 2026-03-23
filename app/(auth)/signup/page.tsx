'use client'

import { useLayoutEffect, useRef } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Sparkles, CheckCircle2, ArrowRight, Github } from 'lucide-react'
import gsap from 'gsap'

export default function SignUp() {
    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

            // 1. Force initial state to prevent "flashing"
            gsap.set([".auth-card", ".form-element", ".promo-content"], { 
                opacity: 0, 
                y: 20 
            })

            // 2. Animate Right Side (The Card)
            tl.to(".auth-card", {
                x: 0,
                y: 0,
                opacity: 1,
                duration: 1.2,
                delay: 0.1
            })
            // 3. Staggered entrance for all form children + Buttons
            // We use .form-element specifically on wrappers to ensure stability
            .to(".form-element", {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.8
            }, "-=0.8")
            
            // 4. Reveal left side content
            .to(".promo-content", {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.15
            }, "-=1.2")

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <main ref={containerRef} className="bg-background flex min-h-screen overflow-hidden">
            
            {/* Left Side: Modern Promo */}
            <div className="relative hidden w-1/2 flex-col justify-between border-r bg-muted/30 p-12 lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/5 to-transparent" />
                
                <div className="promo-content relative z-10">
                    <Logo className="h-8 w-auto" />
                    <div className="mt-24">
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
                    <div className="form-element mb-8 lg:hidden text-center">
                        <Logo className="mx-auto" />
                    </div>

                    <div className="form-element mb-10 text-center lg:text-left">
                        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">Create an account</h1>
                        <p className="text-muted-foreground mt-3 text-lg">
                            Get started with <span className="text-foreground font-semibold">Waterflow</span> today.
                        </p>
                    </div>

                    {/* Added 'block' to card wrapper to help GSAP visibility */}
                    <Card variant="outline" className="auth-card block border-muted/60 bg-card/30 p-8 backdrop-blur-sm overflow-hidden">
                        <form action="" className="space-y-5">
                            <div className="form-element space-y-2.5">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    className="h-11 bg-background/50"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>

                            <div className="form-element space-y-2.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    className="h-11 bg-background/50"
                                    required
                                />
                            </div>

                            {/* Button Wrapped in form-element div for animation stability */}
                            <div className="form-element pt-2">
                                <Button className="group w-full h-11 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98]">
                                    Create Account
                                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </form>

                        <div className="form-element my-8 flex items-center gap-4">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Or</span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-element">
                                <Button type="button" variant="outline" className="w-full h-11 border-muted hover:bg-muted/50">
                                    <svg className="mr-2 size-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C.79 9.84 0 13.01 0 16.45c0 3.44.79 6.61 2.18 9.38l3.66-2.84z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google
                                </Button>
                            </div>
                            <div className="form-element">
                                <Button type="button" variant="outline" className="w-full h-11 border-muted hover:bg-muted/50">
                                    <Github className="mr-2 size-4" />
                                    GitHub
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <p className="form-element mt-10 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="#" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}