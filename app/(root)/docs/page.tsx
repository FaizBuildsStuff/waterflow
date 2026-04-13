import { PageHero } from "@/components/page-hero";

export default function DocsPage() {
    return (
        <main>
            <PageHero 
                subtitle="Developers"
                title="Documentation"
                description="Everything you need to integrate Anthryve into your applications. APIs, Webhooks, and detailed implementation guides."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['Getting Started', 'API Reference', 'SDKs', 'Webhooks', 'Authentication', 'Errors'].map(item => (
                            <div key={item} className="p-6 rounded-2xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                                <h3 className="font-bold text-foreground">{item}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">Detailed guides and references for {item.toLowerCase()}.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
