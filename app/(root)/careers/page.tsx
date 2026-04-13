import { PageHero } from "@/components/page-hero";

export default function CareersPage() {
    return (
        <main>
            <PageHero 
                subtitle="Join Us"
                title="Build the Future"
                description="We are looking for ambitious individuals to join us in defining the next generation of creative and productive tools."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="space-y-6 text-center">
                        <h2 className="text-xl font-bold text-foreground">No open positions currently</h2>
                        <p className="text-muted-foreground">Check back soon or follow us on LinkedIn for updates.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
