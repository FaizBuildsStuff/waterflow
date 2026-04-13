import { PageHero } from "@/components/page-hero";

export default function BlogPage() {
    return (
        <main>
            <PageHero 
                subtitle="Resources"
                title="Anthryve Blog"
                description="Insights, updates, and stories from the team building the production engine of the future."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                        {[
                            { title: 'The Future of AI Creatives', date: 'Oct 24, 2026', author: 'Team Anthryve' },
                            { title: 'Scaling Your Brand in 2027', date: 'Oct 12, 2026', author: 'Marketing Lead' },
                            { title: 'New Feature: Autonomous Storyboarding', date: 'Oct 05, 2026', author: 'Product Team' },
                            { title: 'Design Trends to Watch', date: 'Sep 28, 2026', author: 'Design Lead' },
                        ].map((post, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-video w-full rounded-2xl bg-muted overflow-hidden mb-6 border border-border/50 group-hover:border-indigo-500/50 transition-colors" />
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{post.date}</span>
                                <h3 className="mt-2 text-2xl font-bold text-foreground group-hover:text-indigo-500 transition-colors">{post.title}</h3>
                                <p className="mt-4 text-muted-foreground line-clamp-2">Exploring the intersections of high-end design and automated production workflows in the modern era.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
