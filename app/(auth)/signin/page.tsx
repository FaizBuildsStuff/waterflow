'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ChevronLeft, Github, Mail, Lock, ArrowRight } from 'lucide-react'
import gsap from 'gsap'

export default function SignIn() {
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem('isLoggedIn', 'true')
                if (data.user.onboarded) {
                    router.push('/dashboard')
                } else {
                    router.push('/onboarding')
                }
            } else {
                setError(data.error || 'Sign in failed')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

            // Initial hidden states to prevent flicker
            gsap.set(".login-container", { opacity: 0, y: 20 })
            gsap.set(".stagger-item", { opacity: 0, y: 10 })

            tl.to(".login-container", {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.2
            })
            .to(".stagger-item", {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.8
            }, "-=0.7")
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center px-4 selection:bg-primary/20">
            
            {/* Top Navigation / Back Option */}
            <div className="stagger-item absolute top-8 left-8">
                <Button variant="ghost" asChild className="group text-muted-foreground hover:text-foreground hover:bg-transparent p-0">
                    <Link href="/">
                        <ChevronLeft className="mr-1 size-4 transition-transform group-hover:-translate-x-1" />
                        Back to home
                    </Link>
                </Button>
            </div>

            <div className="login-container m-auto w-full max-w-[400px]">
                {/* Branding & Header */}
                <div className="mb-10 text-center">
                    <div className="stagger-item flex justify-center">
                        <Logo className="h-8 w-fit" />
                    </div>
                    <h1 className="stagger-item mt-6 font-serif text-3xl font-medium tracking-tight">
                        Welcome back
                    </h1>
                    <p className="stagger-item text-muted-foreground mt-2 text-sm">
                        Enter your credentials to access your workspace
                    </p>
                </div>

                <div className="stagger-item bg-card rounded-3xl border border-border p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded-lg">
                                {error}
                            </div>
                        )}
                        {/* Email Field */}
                        <div className="stagger-item space-y-2">
                            <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/40" />
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    className="h-11 pl-10 focus-visible:ring-primary/20 border-border/60 bg-background/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="stagger-item space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                                    Password
                                </Label>
                                <Link href="#" className="text-[11px] font-medium text-primary hover:underline underline-offset-4">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/40" />
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="h-11 pl-10 focus-visible:ring-primary/20 border-border/60 bg-background/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button disabled={loading} className="stagger-item group w-full h-11 text-base font-medium shadow-lg shadow-primary/10 active:scale-[0.98] transition-transform">
                            {loading ? 'Signing in...' : 'Sign In'}
                            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </form>

                    <div className="stagger-item my-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">or</span>
                        <div className="h-px flex-1 bg-border/60" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button type="button" variant="outline" className="stagger-item h-11 border-border/60 hover:bg-muted/50 transition-colors">
                            <Github className="mr-2 size-4" />
                            GitHub
                        </Button>
                        <Button type="button" variant="outline" className="stagger-item h-11 border-border/60 hover:bg-muted/50 transition-colors">
                            <svg className="mr-2 size-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.6"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C.79 9.84 0 13.01 0 16.45c0 3.44.79 6.61 2.18 9.38l3.66-2.84z" opacity="0.4"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity="0.8"/>
                            </svg>
                            Google
                        </Button>
                    </div>
                </div>

                <p className="stagger-item mt-8 text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary font-semibold hover:underline underline-offset-4 decoration-2">
                        Sign up for free
                    </Link>
                </p>
            </div>
        </section>
    )
}