import { PageHero } from "@/components/page-hero";

export default function GovernmentPage() {
    return (
        <main>
            <PageHero 
                subtitle="Solutions"
                title="Secure Infrastructure for Government"
                description="Anthryve provides mission-critical AI infrastructure designed to meet the rigorous security and compliance standards of government agencies."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-muted-foreground leading-relaxed">
                        <p>
                            We understand that public sector organizations require more than just efficiency; they require absolute reliability and data sovereignty. Our government solutions are built on a foundation of air-gapped compatibility and strict access controls.
                        </p>
                        <p>
                            Whether it's accelerating document processing or providing automated citizen services, Anthryve ensures that every interaction is secure, transparent, and auditable.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
