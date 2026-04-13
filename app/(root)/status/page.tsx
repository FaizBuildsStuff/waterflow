import { PageHero } from "@/components/page-hero";

export default function StatusPage() {
    return (
        <main>
            <PageHero 
                subtitle="Help & Security"
                title="System Status"
                description="Real-time status updates for the Anthryve platform and its underlying infrastructure."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="space-y-4">
                        {['Core API', 'Auth Layer', 'AI Engines', 'CDN', 'Dashboard'].map(service => (
                            <div key={service} className="flex items-center justify-between p-6 rounded-2xl border border-border bg-card/30">
                                <span className="font-bold text-foreground">{service}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Operational</span>
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
