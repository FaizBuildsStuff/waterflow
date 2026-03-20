"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Zap, Layout } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const tokens = {
  bg: "#f8f9fb",
  surface: "#ffffff",
  brand: "#1a7fe0",
  text: "#0a0a0a", // Solid near-black for high contrast
  muted: "#52525b", // Zinc-600 for subtext
  border: "rgba(0,0,0,0.08)"
};

export default function FeaturesBento() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bento-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 shadow-sm">
            Capabilities
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
            Go from idea to published <br /> post in <span className="italic font-medium text-zinc-400">minutes</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
          
          {/* Card 1: Keeping White Text on Blue Background */}
          <div className="bento-card md:col-span-3 md:row-span-2 bg-gradient-to-br from-blue-600 to-blue-400 rounded-[32px] p-8 flex flex-col justify-end relative overflow-hidden group shadow-lg">
             <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <Zap className="text-white" size={24} />
             </div>
             <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white leading-tight">
                  Go from idea to published post in <span className="italic opacity-80">minutes</span>
                </h3>
             </div>
             <div className="absolute -right-10 top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          </div>

          {/* Card 2: White Card - All Black Text */}
          <div className="bento-card md:col-span-6 md:row-span-2 bg-white rounded-[32px] border border-zinc-200/60 p-8 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-black">Write a post with your draft ideas naturally</h3>
              <p className="text-zinc-600 text-sm mt-2 max-w-sm font-medium">Our solutions are designed with growth in mind, so your product can evolve.</p>
            </div>
            
            <div className="mt-auto bg-zinc-50 rounded-2xl border border-zinc-200/50 p-6 h-[300px] translate-y-4">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-zinc-200" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-24 bg-zinc-300 rounded-full" />
                    <div className="h-1.5 w-16 bg-zinc-200 rounded-full" />
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-2 w-full bg-white border border-zinc-100 rounded-full" />
                  <div className="h-2 w-full bg-white border border-zinc-100 rounded-full" />
                  <div className="h-2 w-2/3 bg-white border border-zinc-100 rounded-full" />
               </div>
               <div className="absolute top-1/2 right-12 bg-white shadow-2xl rounded-2xl p-4 border border-zinc-100 animate-bounce-slow">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-black">AI Suggestion</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Card 3: White Card - All Black Text */}
          <div className="bento-card md:col-span-3 md:row-span-2 bg-white rounded-[32px] border border-zinc-200/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden">
            <span className="absolute top-8 right-8 text-[9px] font-black uppercase bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">Beta</span>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-black">Write like your favourite creator</h3>
            </div>
            <div className="mt-auto flex -space-x-3 mb-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 shadow-sm" />
               ))}
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
               <p className="text-[11px] text-blue-800 font-bold italic">"Generating post in Alex Hormozi's style..."</p>
            </div>
          </div>

          {/* Card 4: White Card - All Black Text */}
          <div className="bento-card md:col-span-6 md:row-span-1 bg-white rounded-[32px] border border-zinc-200/60 p-8 flex items-center gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-black">Edit and schedule your posts</h3>
              <p className="text-zinc-600 text-sm mt-2 font-medium">Plan and publish your polls at the perfect time, all in one place.</p>
            </div>
            <div className="w-48 h-full bg-zinc-50 rounded-t-2xl border-x border-t border-zinc-200/50 p-4">
               <div className="grid grid-cols-3 gap-2">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-white border border-zinc-100 rounded shadow-sm" />)}
               </div>
            </div>
          </div>

          {/* Card 5: White Card - All Black Text */}
          <div className="bento-card md:col-span-6 md:row-span-1 bg-white rounded-[32px] border border-zinc-200/60 p-8 flex items-center gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-black">Unified Publishing</h3>
              <p className="text-zinc-600 text-sm mt-2 font-medium">One click to LinkedIn, X, and Threads.</p>
            </div>
            <div className="flex gap-3">
               {[1,2,3].map(i => (
                 <div key={i} className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg">
                   <Layout size={20} />
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}