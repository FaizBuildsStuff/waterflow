import { PageHero } from "@/components/page-hero";
import { VisualSection, BentoGrid } from "@/components/page-sections";

export default function AboutPage() {
    return (
        <main>
            <PageHero 
                subtitle="Company"
                title="Building the Intelligent Layer"
                description="We are building the production engine for the next decade. Our mission is to amplify human creativity through autonomous orchestration."
            />

            <VisualSection 
                subtitle="Our Vision"
                title="Cinematic Intelligence"
                description="Anthryve was born from a simple belief: the tools we use should be as ambitious as the stories we tell. We combine state-of-the-art vision models with elite creative direction to help brands hyper-scale their narratives."
                image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop"
            />

            
        </main>
    );
}
