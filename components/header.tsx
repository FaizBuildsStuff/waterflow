"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, ChevronDown, Github, Twitter, Menu, X } from "lucide-react";
import Link from "next/link";

// Define the component design tokens
const tokens = {
  text: "#121212",
  brand: "#1a7fe0",
  muted: "#666666",
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // FIXED: Explicitly type the array ref as HTMLAnchorElement
  const navLinksRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance reveal
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.5
      });

      // 2. Magnetic Link Effect - TypeScript Safe
      navLinksRef.current.forEach((link) => {
        if (!link) return;
        
        const onMouseEnter = () => gsap.to(link, { y: -2, duration: 0.3, ease: "power2.out" });
        const onMouseLeave = () => gsap.to(link, { y: 0, duration: 0.3, ease: "power2.out" });
        
        link.addEventListener("mouseenter", onMouseEnter);
        link.addEventListener("mouseleave", onMouseLeave);
        
        // Cleanup function for listeners (best practice)
        return () => {
          link.removeEventListener("mouseenter", onMouseEnter);
          link.removeEventListener("mouseleave", onMouseLeave);
        };
      });
    }, headerRef);
    
    return () => ctx.revert();
  }, []);

  // Mobile Menu Logic
  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(menuRef.current, {
        clipPath: "circle(150% at 90% 5%)",
        duration: 1,
        ease: "expo.inOut",
      });
      gsap.fromTo(".mobile-link", 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.08, delay: 0.3, ease: "power4.out" }
      );
    } else {
      document.body.style.overflow = "auto";
      gsap.to(menuRef.current, {
        clipPath: "circle(0% at 90% 5%)",
        duration: 0.8,
        ease: "expo.inOut",
      });
    }
  }, [isOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="absolute top-0 left-0 z-[100] w-full h-28 flex items-center px-8 md:px-20"
      >
        <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 z-[110] group">
            <div className="w-10 h-10 bg-black rounded-[12px] flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] group-hover:rotate-[10deg]">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
            </div>
            <span className="text-[14px] font-black tracking-[0.2em] uppercase italic text-black">
              Waterflow
            </span>
          </Link>

          {/* DESKTOP NAV - FIXED REF ASSIGNMENT */}
          <nav className="hidden lg:flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/40 px-2 py-1.5 rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            {["Product", "Solutions", "Developers", "Pricing"].map((item, index) => (
              <Link 
                key={item} 
                href="#" 
                ref={(el) => {
                  if (el) navLinksRef.current[index] = el;
                }}
                className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors rounded-full hover:bg-white transition-all duration-300 flex items-center gap-1.5 group"
              >
                {item}
                {item === "Product" && (
                  <ChevronDown size={12} className="opacity-40 group-hover:rotate-180 transition-transform duration-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
              Sign In
            </button>
            <button className="relative group overflow-hidden bg-black text-white px-7 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]">
              <span className="relative z-10">Get Access</span>
              <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden relative z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-white border border-zinc-100 shadow-sm transition-all active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative w-5 h-4 flex flex-col justify-between items-center">
              <span className={`h-[2px] w-full bg-black rounded-full transition-all duration-500 ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`h-[2px] w-full bg-black rounded-full transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : "opacity-100"}`} />
              <span className={`h-[2px] w-full bg-black rounded-full transition-all duration-500 ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        ref={menuRef}
        style={{ clipPath: "circle(0% at 90% 5%)" }}
        className="fixed inset-0 bg-[#fbfcfd] z-[105] md:hidden flex flex-col justify-between pt-36 pb-12 px-10"
      >
        <div className="space-y-6">
          {["Product", "Solutions", "Pricing", "About"].map((item) => (
            <Link
              key={item}
              href="#"
              onClick={() => setIsOpen(false)}
              className="mobile-link block text-6xl font-bold tracking-tighter text-zinc-900 active:text-blue-600"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="space-y-10">
          <div className="mobile-link grid grid-cols-2 gap-4">
            <button className="h-16 bg-white border border-zinc-200 rounded-2xl font-bold text-sm text-zinc-900 shadow-sm">Sign In</button>
            <button className="h-16 bg-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2">Join <ArrowRight size={18} /></button>
          </div>
          
          <div className="flex justify-between items-center border-t border-zinc-100 pt-8 opacity-40">
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">© 2026 Waterflow</span>
             <div className="flex gap-6"><Twitter size={18} /><Github size={18} /></div>
          </div>
        </div>
      </div>
    </>
  );
}