import { PageHero } from "@/components/page-hero";

export default function PressPage() {
    return (
        <main>
            <PageHero 
                subtitle="Resources"
                title="Press & Media"
                description="Our latest news, brand assets, and contact information for journalists and media outlets."
            />
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Media Inquiries</h2>
                        <p>For press inquiries, please reach out to our media relations team at press@anthryve.com.</p>
                        <div className="mt-12 p-8 rounded-2xl border border-border bg-card/30">
                            <h3 className="font-bold text-foreground">Brand Assets</h3>
                            <p className="mt-2">Download our official logos, brand guidelines, and executive headshots.</p>
                            <button className="mt-6 h-10 px-6 rounded-full bg-border text-foreground text-sm font-bold hover:bg-muted transition-colors">Download Kit (.ZIP)</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
