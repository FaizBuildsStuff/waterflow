"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Zap, Layout, Layers, Users, BarChart3, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesBento() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.from(".bento-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power4.out",
      });

      // Subtle floating animation for the AI Badge
      gsap.to(".ai-float", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
            Core Engine
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-serif font-medium tracking-tight text-foreground">
            Unified intelligence for <br />
            <span className="text-muted-foreground italic">high-velocity</span> teams.
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">

          {/* Card 1: Main AI Feature */}
          <div className="bento-card md:col-span-4 md:row-span-2 bg-gradient-to-b from-primary to-[#0052FF] rounded-[40px] p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-all duration-700" />

            <div className="z-10 bg-white/20 backdrop-blur-xl rounded-2xl p-4 w-fit border border-white/20 shadow-inner">
              <Bot className="text-white" size={32} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white leading-tight tracking-tight">
                Autonomous Task <br /> Decomposition.
              </h3>
              <p className="text-white/70 mt-4 font-medium leading-relaxed">
                Input a goal, and Anthryve drafts your entire project architecture in seconds.
              </p>
            </div>
          </div>

          {/* Card 2: Real-time Workspace */}
          <div className="bento-card md:col-span-8 md:row-span-2 bg-card rounded-[40px] border border-border p-10 flex flex-col shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground">The Unified Workspace</h3>
                <p className="text-muted-foreground mt-2 max-w-sm font-medium">Sync documentation, tasks, and team chat in a single cognitive flow.</p>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-card bg-muted flex items-center justify-center text-[10px] font-bold">U{i}</div>
                ))}
              </div>
            </div>

            {/* Mock UI Element */}
            <div className="mt-auto bg-muted/30 rounded-t-[32px] border-t border-x border-border p-8 h-[320px] translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <div className="h-3 w-48 bg-muted-foreground/20 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-2xl bg-background border border-border p-4">
                    <div className="h-2 w-12 bg-primary/40 rounded-full mb-3" />
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full" />
                      <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full" />
                    </div>
                  </div>
                  <div className="h-24 rounded-2xl bg-background border border-border p-4">
                    <div className="h-2 w-12 bg-green-500/40 rounded-full mb-3" />
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full" />
                      <div className="h-1.5 w-full bg-muted-foreground/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="ai-float absolute top-20 right-20 bg-primary text-white shadow-2xl rounded-2xl p-4 flex items-center gap-3 border border-white/20">
                <Sparkles size={16} />
                <span className="text-xs font-bold tracking-wider uppercase">AI Digest Syncing...</span>
              </div>
            </div>
          </div>

          {/* Card 3: Analytics */}
          <div className="bento-card md:col-span-5 md:row-span-1 bg-card rounded-[40px] border border-border p-8 flex items-center gap-6 shadow-sm group">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <BarChart3 size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Velocity Tracking</h3>
              <p className="text-muted-foreground text-sm mt-1 font-medium">Predictive analytics for team deadlines.</p>
            </div>
          </div>

          {/* Card 4: Daily Digest */}
          <div className="bento-card md:col-span-7 md:row-span-1 bg-card rounded-[40px] border border-border p-8 flex items-center justify-between shadow-sm group overflow-hidden">
            <div className="z-10">
              <h3 className="text-xl font-bold text-foreground">Automated Daily Digests</h3>
              <p className="text-muted-foreground text-sm mt-1 font-medium">Get a summarized pulse of your team's progress via Slack or Email.</p>
            </div>
            <div className="flex gap-2 translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
              {[1, 2].map(i => (
                <div key={i} className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center border border-border shadow-inner">
                  <Layers size={24} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}