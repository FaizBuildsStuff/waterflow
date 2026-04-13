import { PageHero } from "@/components/page-hero";
import { VisualSection, BentoGrid } from "@/components/page-sections";

export default function OverviewPage() {
    return (
        <main>
            <PageHero 
                subtitle="The Engine"
                title="Hyper-Scale Production for the Modern Brand"
                description="Anthryve is the intelligence layer for creative teams. We combine cinematic vision with autonomous orchestration to build the future of brand storytelling."
            />

            <VisualSection 
                subtitle="Intelligent Core"
                title="Autonomous Creative Orchestration"
                description="Our proprietary engine analyzes brand DNA to generate thousands of cinematic variations in real-time. Stop thinking in static campaigns and start building evolving narratives."
                image="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop"
            />

            <BentoGrid 
                items={[
                    {
                        title: 'Real-time Rendering',
                        description: 'Cloud-native processing that delivers 8k output in seconds, not hours.',
                        span: 'md:col-span-2'
                    },
                    {
                        title: 'Brand Consistency',
                        description: 'Every pixel aligns with your core identity using neural feedback loops.',
                    },
                    {
                        title: 'Global Delivery',
                        description: 'Automatically optimize and deploy content across every channel simultaneously.',
                    },
                    {
                        title: 'Autonomous Scaling',
                        description: 'Watch your creative production volume increase by 10x without adding new headcounts.',
                        span: 'md:col-span-2'
                    }
                ]}
            />

            <VisualSection 
                reverse
                subtitle="Connectivity"
                title="Ecosystem-Wide Integration"
                description="Anthryve sits at the heart of your tech stack. We bridge the gap between your data warehouse and your creative output, ensuring every ad is hyper-personalized and data-driven."
                image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
            />

            <section className="py-24 border-t border-border/50 text-center">
                <div className="mx-auto max-w-2xl px-6">
                    <h2 className="text-4xl font-serif font-medium tracking-tight mb-8">Ready to evolve?</h2>
                    <p className="text-lg text-muted-foreground mb-12">Join the world's most innovative brands building on Anthryve.</p>
                    <button className="h-14 px-10 rounded-full bg-foreground text-background font-bold hover:brightness-110 transition-all shadow-xl shadow-foreground/10">
                        Request Private Access
                    </button>
                </div>
            </section>
        </main>
    );
}
