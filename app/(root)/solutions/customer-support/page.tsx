import { PageHero } from "@/components/page-hero";
import { VisualSection, BentoGrid } from "@/components/page-sections";

export default function CustomerSupportPage() {
    return (
        <main>
            <PageHero 
                subtitle="Solutions"
                title="AI-Powered Customer Excellence"
                description="Transform your customer support with Anthryve's advanced AI agents. Reduce response times and increase satisfaction at scale."
            />

            <VisualSection 
                subtitle="Support Automation"
                title="Empathetic AI Resolution"
                description="Our AI agents don't just respond; they understand. By leveraging deep sentiment analysis and real-time context, Anthryve resolves up to 80% of inquiries without human intervention."
                image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop"
            />
        </main>
    );
}
