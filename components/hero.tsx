"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Sparkles, ArrowRight, Play, Command, 
  Cpu, Zap, Activity, Globe, Fingerprint 
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const tokens = {
  bg: "#f8f9fb",
  text: "#08090a",
  brand: "#1a7fe0",
  accent: "#1abcaa",
};

export default function HeroSection() {
  const scope = useRef(null);
  const mockupFrame = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.8 } });

      // 1. Reveal Sequence
      tl.from(".reveal-up", { 
        y: 120, 
        opacity: 0, 
        stagger: 0.1, 
        skewY: 6,
        clipPath: "inset(100% 0% 0% 0%)" 
      })
      .from(".ui-node", { scale: 0.8, opacity: 0, stagger: 0.15 }, "-=1.4")
      .from(".console-box", { y: 40, opacity: 0, filter: "blur(10px)" }, "-=1.2");

      // 2. Parallax Tilt for the "Billion Dollar" Mockup
      gsap.to(mockupFrame.current, {
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        rotateX: 12,
        scale: 1.05,
        y: -100,
        boxShadow: "0 80px 150px -40px rgba(0,0,0,0.15)"
      });

      // 3. Ambient Node Floating
      gsap.to(".ui-node", {
        y: "random(-20, 20)",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.4, from: "random" }
      });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={scope} 
      className="relative min-h-[180vh] flex flex-col items-center pt-48 px-6 overflow-hidden"
      style={{ backgroundColor: tokens.bg, perspective: "1500px" }}
    >
      {/* --- BACKGROUND ARCHITECTURE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fine Grain Texture overlay for that "Premium Paper" feel */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" 
             style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
        
        {/* Modern Fluid Gradients */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(26,127,224,0.08)_0%,transparent_100%)]" />
        
        {/* Subtle Grid - Professional Standard */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `linear-gradient(${tokens.text} 1px, transparent 1px), linear-gradient(90deg, ${tokens.text} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      {/* --- SPATIAL UI NODES (Eliminates "Empty" feeling) --- */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block">
        <div className="ui-node absolute top-[20%] left-[10%] bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"><Zap size={16}/></div>
          <div><p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Efficiency</p><p className="text-xs font-bold">+42% Flow</p></div>
        </div>
        <div className="ui-node absolute top-[35%] right-[12%] bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-center gap-3">
          <Activity size={18} className="text-teal-500" />
          <div className="pr-4"><p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Neural Link</p><p className="text-xs font-bold">Active</p></div>
        </div>
        <div className="ui-node absolute top-[60%] left-[14%] bg-black p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white">
          <Fingerprint size={18} className="text-blue-400" />
          <span className="text-xs font-bold">Encrypted Workspace</span>
        </div>
      </div>

      {/* --- MAIN HERO CONTENT --- */}
      <div className="relative z-20 w-full max-w-[1400px] flex flex-col items-center text-center">
        
        {/* Status Badge */}
        <div className="reveal-up mb-8 inline-flex items-center gap-3 bg-white border border-zinc-100 px-4 py-2 rounded-full shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Infrastructure v4.0 is Live</span>
        </div>

        {/* THE MILLION DOLLAR HEADLINE */}
        <h1 className="reveal-up text-7xl md:text-[145px] font-bold leading-[0.8] tracking-[-0.07em] mb-12" style={{ color: tokens.text }}>
          Architect your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#1a7fe0] to-[#08090a] italic font-medium">unbroken flow.</span>
        </h1>

        <p className="reveal-up max-w-3xl text-xl md:text-2xl font-medium text-zinc-500 leading-relaxed mb-20">
          Waterflow isn’t a task manager. It’s an <span className="text-black">autonomous workspace engine</span> that <br /> 
          synchronizes your team’s cognitive energy into a single, fluid current.
        </p>

        {/* --- COMMAND CONSOLE --- */}
        <div className="console-box w-full max-w-3xl relative mb-44 group">
          <div className="bg-white/90 backdrop-blur-3xl p-3 rounded-[32px] border border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 hover:shadow-[0_60px_130px_-20px_rgba(26,127,224,0.15)]">
            <div className="flex items-center px-6 py-4 gap-5">
              <Command className="text-blue-500" size={24} />
              <input 
                type="text" 
                placeholder="Synchronize project 'Nebula' with my weekly capacity..." 
                className="flex-1 bg-transparent outline-none text-xl font-medium placeholder:text-zinc-300"
              />
              <button className="bg-[#1a7fe0] text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95">
                Execute <ArrowRight size={18} />
              </button>
            </div>
            {/* Quick Prompt Tokens */}
            <div className="flex gap-3 px-4 pb-3">
               {['Automate Sprints', 'AI Daily Digest', 'Node Analysis'].map(t => (
                 <button key={t} className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-zinc-50 text-zinc-400 hover:bg-black hover:text-white transition-all">
                    {t}
                 </button>
               ))}
            </div>
          </div>
          {/* Keyboard Hint */}
          <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
            <kbd className="px-2 py-1 bg-zinc-200 rounded text-[10px] font-bold tracking-widest text-black">CMD + K</kbd>
            <span className="text-[10px] font-bold uppercase tracking-widest">to trigger intelligence</span>
          </div>
        </div>

        {/* --- CENTRAL PRODUCT MOCKUP --- */}
        <div 
          ref={mockupFrame}
          className="relative w-full aspect-[16/10] max-w-7xl rounded-[60px] p-4 bg-gradient-to-b from-white/80 to-transparent border border-white shadow-2xl overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-full h-full rounded-[48px] bg-white border border-zinc-100 relative overflow-hidden flex items-center justify-center">
            
            {/* Mock Dashboard Layout (Fills the visual) */}
            <div className="absolute inset-0 flex">
               <div className="w-64 border-r border-zinc-50 p-10 hidden lg:block opacity-20">
                  <div className="space-y-8">
                     {[1,2,3,4,5].map(i => <div key={i} className="h-2 w-full bg-zinc-200 rounded-full" />)}
                  </div>
               </div>
               <div className="flex-1 p-20 opacity-10">
                  <div className="grid grid-cols-3 gap-10">
                    {[1,2,3].map(i => <div key={i} className="aspect-square bg-zinc-100 rounded-3xl" />)}
                  </div>
               </div>
            </div>

            {/* Play Button - The Visual Focus */}
            <div className="relative z-30 group cursor-pointer flex flex-col items-center gap-10">
               <div className="relative">
                  <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-1000" />
                  <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all duration-1000">
                    <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center text-white">
                      <Play fill="white" size={40} className="ml-1" />
                    </div>
                  </div>
               </div>
               <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-[0.6em] text-zinc-900">Watch the current</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2 tracking-widest">Interface v2.4 (4:12)</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}