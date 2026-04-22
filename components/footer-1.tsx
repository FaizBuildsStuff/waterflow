import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, Send } from 'lucide-react'
import { socialLinks } from '@/lib/social-links'

const footerLinks = {
    Product: [
        { label: 'Pro Plan', href: '/plans' },
        { label: 'Free Tier', href: '/plans' },
        { label: 'Neural Plan', href: '/plans' },
        { label: 'Pricing', href: '/plans' },
    ],
    Solutions: [
        { label: 'Support', href: '/solutions/customer-support' },
        { label: 'Government', href: '/solutions/government' },
        { label: 'Security', href: '/solutions/security' },
    ],
    Company: [
        { label: 'Overview', href: '/overview' },
        { label: 'Docs', href: '/docs' },
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Futures', href: '/anthryve-futures' },
    ],
    Resources: [
        { label: 'Blog', href: '/blog' },
        { label: 'Community', href: '/community' },
        { label: 'Stories', href: '/customer-stories' },
        { label: 'Press', href: '/press' },
    ],
    Support: [
        { label: 'Availability', href: '/availability' },
        { label: 'Status', href: '/status' },
        { label: 'Help Center', href: '/support-center' },
    ],
    legal: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
    ]
}

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-background pt-32 pb-12 select-none">
            {/* Background Texture & Gradients */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_100%)]" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.2))]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
            
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
                    
                    {/* Branding Section */}
                    <div className="lg:col-span-4">
                        <div className="space-y-8">
                            <Link href="/" className="inline-block group transition-all duration-500 hover:scale-[1.02]">
                                <Logo className="h-8 w-auto" />
                            </Link>
                            <p className="max-w-[300px] text-base leading-relaxed text-muted-foreground/70 font-medium">
                                Architecting the future of production with <span className="text-foreground">cinematic AI</span> and hyper-scale growth engines.
                            </p>
                            
                            <div className="flex items-center gap-3">
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 transition-all duration-300 hover:border-foreground/30 hover:bg-white/5 hover:-translate-y-1"
                                        aria-label={social.name}
                                    >
                                        <div className="absolute inset-0 rounded-xl bg-white/0 opacity-0 blur-xl transition-all duration-300 group-hover:bg-white/5 group-hover:opacity-100" />
                                        <social.icon className="h-[18px] w-[18px] text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
                            {Object.entries(footerLinks).filter(([key]) => key !== 'legal').map(([category, links]) => (
                                <div key={category} className="space-y-6">
                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/40">{category}</h3>
                                    <ul className="space-y-4">
                                        {links.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    href={link.href}
                                                    className="group relative inline-flex items-center text-[15px] font-medium text-muted-foreground/80 transition-all duration-300 hover:text-foreground"
                                                >
                                                    <span className="relative">
                                                        {link.label}
                                                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground/40 transition-all duration-300 group-hover:w-full" />
                                                    </span>
                                                    <ArrowUpRight className="ml-1 h-3 w-3 translate-x-[-4px] translate-y-[4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Newsletter & Bottom Bar */}
                <div className="mt-24">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-card/40 to-muted/40 p-1 lg:p-1.5 shadow-2xl backdrop-blur-md">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-8 py-10 lg:px-12">
                            <div className="max-w-md text-center lg:text-left">
                                <h3 className="text-2xl font-bold tracking-tight text-foreground">Stay at the frontier</h3>
                                <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed font-medium">
                                    Join 10,000+ growth leaders receiving our weekly creative teardowns.
                                </p>
                            </div>
                            
                            <form className="w-full max-w-sm">
                                <div className="relative group">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="h-14 w-full rounded-2xl bg-background/50 border border-border/80 px-6 pr-16 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10 focus-visible:border-foreground/20 group-hover:border-foreground/10"
                                    />
                                    <button 
                                        type="submit"
                                        className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center rounded-xl bg-foreground text-background transition-all duration-300 hover:scale-105 active:scale-95 group-hover:bg-foreground group-hover:text-background group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col items-center justify-between gap-8 border-t border-border/50 pt-10 sm:flex-row">
                        <div className="flex items-center gap-6">
                            <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest">
                                &copy; {new Date().getFullYear()} Anthryve
                            </p>
                            <div className="h-4 w-px bg-border/50 hidden sm:block" />
                            <div className="flex gap-6">
                                {footerLinks.legal.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40 transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        
                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/20">
                            Forged with precision
                        </p>
                    </div>
                </div>
            </div>

            {/* Cinematic Watermark Overlay */}
            <div className="pointer-events-none absolute bottom-[-5%] left-1/2 -translate-x-1/2 select-none overflow-hidden w-full text-center">
                <span className="inline-block text-[18vw] font-black leading-none bg-gradient-to-t from-transparent via-foreground/[0.04] to-transparent bg-clip-text text-transparent uppercase tracking-tighter opacity-50 blur-[2px]">
                    Anthryve
                </span>
            </div>
        </footer>
    )
}
