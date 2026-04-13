import { PageHero } from "@/components/page-hero";
import { VisualSection, BentoGrid } from "@/components/page-sections";

export default function AnthryveFuturesPage() {
    return (
        <main>
            <PageHero 
                subtitle="Innovations"
                title="Engineering the Next Decade"
                description="Explore the R&D projects and long-term vision of Anthryve. We are pushing the boundaries of autonomous creativity and machine perception."
            />

            <VisualSection 
                subtitle="Research Lab"
                title="Autonomous Storytelling"
                description="Our Futures lab is currently developing the first self-correcting creative engine. Imagine a production workflow that learns from audience engagement in real-time and recreates itself to maximize impact."
                image="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop"
            />

            <BentoGrid 
                items={[
                    {
                        title: 'Neural Rendering',
                        description: 'Generating hyper-realistic cinematic environments directly from text prompts.',
                        span: 'md:col-span-2'
                    },
                    {
                        title: 'Emotional AI',
                        description: 'Deep-learning models that understand and simulate human emotional responses to visual stimuli.',
                        span: 'md:col-span-1'
                    },
                    {
                        title: 'Edge Production',
                        description: 'Optimizing high-fidelity rendering for local edge devices without compromising on cinematic quality.',
                        span: 'md:col-span-1'
                    },
                    {
                        title: 'Quantum Strategy',
                        description: 'Using quantum-inspired algorithms to solve the most complex creative distribution problems.',
                        span: 'md:col-span-2'
                    }
                ]}
            />
        </main>
    );
}
