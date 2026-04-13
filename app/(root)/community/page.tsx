import { PageHero } from "@/components/page-hero";

export default function CommunityPage() {
    return (
        <main>
            <PageHero 
                subtitle="Resources"
                title="Anthryve Community"
                description="Connect with thousands of creators and growth leaders building the next generation of brands."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6 text-center">
                    <div className="p-12 rounded-3xl border border-border bg-card/30">
                        <h2 className="text-3xl font-bold text-foreground">Join the Discord</h2>
                        <p className="mt-4 text-muted-foreground mx-auto max-w-md">Our community is the heartbeat of Anthryve. Share workflows, get feedback, and collaborate with peers.</p>
                        <button className="mt-8 h-12 px-8 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors">Launch Discord</button>
                    </div>
                </div>
            </section>
        </main>
    );
}
