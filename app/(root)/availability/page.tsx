import { PageHero } from "@/components/page-hero";

export default function AvailabilityPage() {
    return (
        <main>
            <PageHero 
                subtitle="Help & Security"
                title="Service Availability"
                description="We've built Anthryve to be resilient. Track our uptime and service metrics across all global regions."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="p-12 rounded-3xl border border-border bg-card/30 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xl font-bold text-foreground">All Systems Operational</span>
                        </div>
                        <p className="text-muted-foreground">Historical uptime: 99.98% over the last 365 days.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
