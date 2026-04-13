import { PageHero } from "@/components/page-hero";

export default function SupportCenterPage() {
    return (
        <main>
            <PageHero 
                subtitle="Help"
                title="Support Center"
                description="Our team and resources are here to help you get the most out of Anthryve. Find answers, open tickets, or chat with us live."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl border border-border bg-card/30 text-center">
                            <h2 className="text-xl font-bold mb-4">Contact Support</h2>
                            <p className="text-muted-foreground mb-6">Our average response time for Pro and Neural plan users is under 15 minutes.</p>
                            <button className="h-12 w-full rounded-full bg-foreground text-background font-bold hover:brightness-110 transition-all">Submit a Ticket</button>
                        </div>
                        <div className="p-8 rounded-3xl border border-border bg-card/30 text-center">
                            <h2 className="text-xl font-bold mb-4">Live Support</h2>
                            <p className="text-muted-foreground mb-6">Speak directly with an Anthryve engineer via our live chat system.</p>
                            <button className="h-12 w-full rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all">Start Chat</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
