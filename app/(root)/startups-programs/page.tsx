import { PageHero } from "@/components/page-hero";

export default function StartupsProgramsPage() {
    return (
        <main>
            <PageHero 
                subtitle="Resources"
                title="Anthryve for Startups"
                description="Fuel your growth with the Anthryve Startup Program. We provide eligible startups with free credits, mentorship, and deep-tier support."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Free Credits', desc: 'Up to $5,000 in platform credits for 12 months.' },
                            { title: 'Mentorship', desc: 'Direct access to our product and scale engineers.' },
                            { title: 'Community', desc: 'Join an exclusive circle of high-velocity founders.' },
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-2xl border border-border bg-card/30">
                                <h3 className="font-bold text-foreground text-lg mb-4">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
