'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { 
    Menu, X, ArrowRight, ChevronRight, 
    Headphones, Globe, Shield, Newspaper, 
    Users, MessageSquare, Terminal, Zap, 
    LifeBuoy, Layout, Info, Briefcase, 
    Cpu, Activity, CreditCard, Box,
    ChevronDown
} from 'lucide-react'
import { socialLinks } from '@/lib/social-links'
import { Button } from '@/components/ui/button'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils'

const navigationLinks = {
    solutions: [
        { name: 'Customer Support', href: '/solutions/customer-support', description: 'Scale your support with AI-driven workflows.', icon: Headphones },
        { name: 'Government', href: '/solutions/government', description: 'Secure and compliant solutions for public sectors.', icon: Globe },
        { name: 'Security', href: '/solutions/security', description: 'Enterprise-grade protection for your cognitive data.', icon: Shield },
    ],
    resources: [
        { name: 'Blog', href: '/blog', description: 'Insights on AI productivity and growth.', icon: Newspaper },
        { name: 'Community', href: '/community', description: 'Connect with other high-velocity teams.', icon: Users },
        { name: 'Customer Stories', href: '/customer-stories', description: 'See how agencies scale with Anthryve.', icon: MessageSquare },
        { name: 'Documentation', href: '/docs', description: 'Detailed guides and API references.', icon: Terminal },
        { name: 'Events', href: '/events', description: 'Join our workshops and webinars.', icon: Zap },
        { name: 'Support Center', href: '/support-center', description: 'Get help from our expert team.', icon: LifeBuoy },
    ],
    company: [
        { name: 'Overview', href: '/overview', description: 'Learn about our mission and vision.', icon: Layout },
        { name: 'About Us', href: '/about', description: 'Meet the team behind the engine.', icon: Info },
        { name: 'Careers', href: '/careers', description: 'Join us in architecting the future.', icon: Briefcase },
        { name: 'Futures', href: '/anthryve-futures', description: 'Our long-term R&D initiatives.', icon: Cpu },
        { name: 'Press', href: '/press', description: 'Latest news and media kit.', icon: Newspaper },
        { name: 'System Status', href: '/status', description: 'Real-time performance metrics.', icon: Activity },
    ]
}

export const HeroHeader = () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // First check localStorage for quick UI state
        const localLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        setIsLoggedIn(localLoggedIn)

        // Then verify with API to be sure
        fetch('/api/auth/me')
          .then(res => {
            if (res.ok) {
              setIsLoggedIn(true)
              localStorage.setItem('isLoggedIn', 'true')
            } else {
              setIsLoggedIn(false)
              localStorage.setItem('isLoggedIn', 'false')
            }
          })
          .catch(() => {
            setIsLoggedIn(false)
            localStorage.setItem('isLoggedIn', 'false')
          })
    }, [])

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="relative z-50">
            <nav
                className={cn(
                    'fixed left-0 right-0 top-0 transition-all duration-500 ease-in-out',
                    isScrolled 
                        ? 'py-3' 
                        : 'py-6'
                )}
            >
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div 
                        className={cn(
                            "relative flex items-center justify-between gap-6 px-4 py-2 transition-all duration-500",
                            isScrolled 
                                ? "rounded-full border border-white/10 bg-background/60 shadow-lg backdrop-blur-xl dark:bg-zinc-900/60" 
                                : "bg-transparent"
                        )}
                    >
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <Logo className="h-8 w-auto" isScrolled={isScrolled} />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:block">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-1">
                                    <NavigationMenuItem>
                                        <NavigationMenuLink asChild>
                                            <Link href="/#features" className={cn(
                                                navigationMenuTriggerStyle(),
                                                "bg-transparent hover:bg-transparent focus:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                                            )}>
                                                Features
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-muted-foreground hover:text-foreground">
                                            Solutions
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                {navigationLinks.solutions.map((item) => (
                                                    <ListItem key={item.name} title={item.name} href={item.href} icon={item.icon}>
                                                        {item.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-muted-foreground hover:text-foreground">
                                            Resources
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                {navigationLinks.resources.map((item) => (
                                                    <ListItem key={item.name} title={item.name} href={item.href} icon={item.icon}>
                                                        {item.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuLink asChild>
                                            <Link href="/#pricing" className={cn(
                                                navigationMenuTriggerStyle(),
                                                "bg-transparent hover:bg-transparent focus:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                                            )}>
                                                Pricing
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent text-muted-foreground hover:text-foreground">
                                            Company
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                {navigationLinks.company.map((item) => (
                                                    <ListItem key={item.name} title={item.name} href={item.href} icon={item.icon}>
                                                        {item.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <div className="hidden items-center gap-3 sm:flex">
                                {isLoggedIn ? (
                                    <>
                                        <Link 
                                            href="/dashboard" 
                                            className="text-sm font-medium text-muted-foreground hover:text-foreground"
                                        >
                                            Dashboard
                                        </Link>
                                        <Button asChild size="sm" className="rounded-full shadow-md">
                                            <Link href="/dashboard">
                                                Go to App
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            href="/signin" 
                                            className="text-sm font-medium text-muted-foreground hover:text-foreground"
                                        >
                                            Log in
                                        </Link>
                                        <Button asChild size="sm" className="rounded-full shadow-md">
                                            <Link href="/signup">
                                                Sign up
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Mobile Toggle with Sheet */}
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <button
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 lg:hidden"
                                        aria-label="Toggle Menu"
                                    >
                                        <Menu size={20} />
                                    </button>
                                </SheetTrigger>
                                <SheetContent showCloseButton={false} side="right" className="flex flex-col w-full sm:max-w-md border-none bg-background/95 backdrop-blur-3xl p-0 h-full shadow-2xl">
                                    <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
                                        <Logo className="h-8 w-auto" isScrolled={true} />
                                        <button 
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto px-6 py-8">
                                        <div className="space-y-10">
                                            <section>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-6">Product</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <MobileLink href="/#features" icon={Zap} label="Features" onClick={() => setIsOpen(false)} />
                                                    <MobileLink href="/#pricing" icon={CreditCard} label="Pricing" onClick={() => setIsOpen(false)} />
                                                    <MobileLink href="/#integrations" icon={Box} label="Integrations" onClick={() => setIsOpen(false)} />
                                                </div>
                                            </section>

                                            <section>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-6">Solutions</h4>
                                                <ul className="space-y-4">
                                                    {navigationLinks.solutions.map(item => (
                                                        <MobileListItem key={item.name} {...item} onClick={() => setIsOpen(false)} />
                                                    ))}
                                                </ul>
                                            </section>

                                            <section>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-6">Resources</h4>
                                                <ul className="space-y-4">
                                                    {navigationLinks.resources.map(item => (
                                                        <MobileListItem key={item.name} {...item} onClick={() => setIsOpen(false)} />
                                                    ))}
                                                </ul>
                                            </section>

                                            <section>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-6">Company</h4>
                                                <ul className="space-y-4">
                                                    {navigationLinks.company.map(item => (
                                                        <MobileListItem key={item.name} {...item} onClick={() => setIsOpen(false)} />
                                                    ))}
                                                </ul>
                                            </section>
                                        </div>
                                    </div>

                                    <div className="px-6 py-8 bg-gradient-to-t from-background via-background to-transparent border-t border-white/5 space-y-6">
                                        <div className="flex flex-col gap-3">
                                            <Button variant="outline" className="w-full rounded-2xl py-7 border-white/10 bg-white/5 hover:bg-white/10 text-base font-semibold" asChild>
                                                <Link href="/signin">Log in</Link>
                                            </Button>
                                            <Button className="w-full rounded-2xl py-7 shadow-2xl shadow-zinc-500/20 text-base font-semibold bg-foreground text-background hover:bg-foreground/90" asChild>
                                                <Link href="/signup">Get Started Free</Link>
                                            </Button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4">
                                            <div className="flex gap-5">
                                                {socialLinks.map((link) => (
                                                    <a 
                                                        key={link.name}
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                        aria-label={link.name}
                                                    >
                                                        <link.icon size={18} />
                                                    </a>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">&copy; 2026 Anthryve</span>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const MobileLink = ({ href, icon: Icon, label, onClick }: { href: string, icon: any, label: string, onClick: () => void }) => (
    <Link 
        href={href} 
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
    >
        <Icon size={20} className="text-foreground" />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </Link>
)

const MobileListItem = ({ name, href, description, icon: Icon, onClick }: { name: string, href: string, description: string, icon: any, onClick: () => void }) => (
    <li>
        <Link 
            href={href} 
            onClick={onClick}
            className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group active:scale-[0.98]"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-500/10 border border-zinc-500/20 group-hover:bg-zinc-500/20 transition-colors">
                <Icon size={20} className="text-foreground" />
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold tracking-tight text-foreground">{name}</span>
                    <ChevronRight size={14} className="text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-1">{description}</p>
            </div>
        </Link>
    </li>
)


const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string; icon?: any }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />}
                        <div className="text-sm font-medium leading-none">{title}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"