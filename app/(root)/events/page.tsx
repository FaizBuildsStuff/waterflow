import { PageHero } from "@/components/page-hero";

export default function EventsPage() {
    return (
        <main>
            <PageHero 
                subtitle="Resources"
                title="Upcoming Events"
                description="Join the Anthryve team at conferences, webinars, and meetups around the globe."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="space-y-4">
                        {[
                            { name: 'Anthryve Global Summit 2026', location: 'San Francisco & Online', date: 'Dec 15-16' },
                            { name: 'AI Creative Workshop', location: 'YouTube Live', date: 'Nov 04' },
                            { name: 'Enterprise Scalability Webinar', location: 'Zoom', date: 'Oct 28' },
                        ].map((event, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-2xl border border-border bg-card/30 hover:border-indigo-500/50 transition-colors gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">{event.name}</h3>
                                    <p className="text-muted-foreground">{event.location}</p>
                                </div>
                                <div className="text-lg font-bold text-indigo-500">{event.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
