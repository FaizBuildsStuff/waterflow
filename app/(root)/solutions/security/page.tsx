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

            <BentoGrid 
                items={[
                    {
                        title: 'Isolation Protocols',
                        description: 'Every project runs in a dedicated, sandboxed environment to prevent cross-contamination of data.',
                        span: 'md:col-span-2'
                    },
                    {
                        title: 'SOC2 Compliant',
                        description: 'Built to meet the highest industry standards for security, availability, and confidentiality.',
                        span: 'md:col-span-1'
                    },
                    {
                        title: 'Anomaly Detection',
                        description: 'Real-time AI monitoring that identifies and neuralizes potential threats before they execute.',
                        span: 'md:col-span-1'
                    },
                    {
                        title: 'Audit Logging',
                        description: 'Detailed, immutable logs of every AI interaction and data access event within your workspace.',
                        span: 'md:col-span-2'
                    }
                ]}
            />
        </main>
    );
}
