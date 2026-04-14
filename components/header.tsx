'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X, ArrowRight } from 'lucide-react'
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

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Integrations', href: '#integrations' },
    { name: 'Resources', href: '#resources' },
]

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
                                <NavigationMenuList>
                                    {menuItems.map((item) => (
                                        <NavigationMenuItem key={item.name}>
                                            <NavigationMenuLink asChild>
                                                <Link href={item.href} className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                                                )}>
                                                    {item.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
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
                                <SheetContent side="right" className="w-full sm:max-w-xs border-white/10 bg-background/95 backdrop-blur-xl">
                                    <SheetHeader>
                                        <SheetTitle className="text-left">
                                            <Logo className="h-8 w-auto" isScrolled={true} />
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-8 flex flex-col gap-6">
                                        <ul className="space-y-4">
                                            {menuItems.map((item) => (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                        <hr className="border-white/10" />
                                        <div className="flex flex-col gap-4">
                                            <Button variant="outline" className="w-full rounded-2xl py-6" asChild>
                                                <Link href="/signin">Log in</Link>
                                            </Button>
                                            <Button className="w-full rounded-2xl py-6 shadow-xl" asChild>
                                                <Link href="/signup">Get Started Free</Link>
                                            </Button>
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