import { PageHero } from "@/components/page-hero";

export default function CustomerStoriesPage() {
    return (
        <main>
            <PageHero 
                subtitle="Resources"
                title="Customer Stories"
                description="See how world-class brands are using Anthryve to scale their content and growth operations."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { brand: 'CloudScale', result: '300% ROAS Increase' },
                            { brand: 'FutureFlow', result: '10x Faster Turnaround' },
                            { brand: 'Zenith SaaS', result: '50% Lower CAC' },
                        ].map((story, i) => (
                            <div key={i} className="p-8 rounded-3xl border border-border bg-card/30">
                                <h3 className="text-xl font-bold text-foreground">{story.brand}</h3>
                                <p className="mt-2 text-3xl font-serif text-indigo-500">{story.result}</p>
                                <p className="mt-4 text-muted-foreground leading-relaxed">By implementing Anthryve's autonomous creative engine, {story.brand} was able to test thousands of variations effortlessly.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
