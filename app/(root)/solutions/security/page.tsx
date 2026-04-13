import { PageHero } from "@/components/page-hero";
import { VisualSection, BentoGrid } from "@/components/page-sections";

export default function SecurityPage() {
    return (
        <main>
            <PageHero 
                subtitle="Solutions"
                title="Enterprise-Grade AI Security"
                description="Secure your business operations with Anthryve's layered security architecture. We provide advanced threat detection and automated response systems."
            />

            <VisualSection 
                subtitle="Data Sovereignty"
                title="Privacy-First Intelligence"
                description="Your data is your most valuable asset. Anthryve ensures that every byte processed remains within your controlled environment, with end-to-end encryption and zero-knowledge architecture."
                image="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop"
            />

            
        </main>
    );
}
