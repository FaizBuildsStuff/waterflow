import { Lightbulb, Pencil, PencilRuler } from 'lucide-react'

export default function Content() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div className="space-y-4">
                    <h2 className="text-balance font-serif text-4xl font-medium">Content that feels architected, not just written.</h2>
                    <p className="text-muted-foreground">Anthryve’s creative engine doesn't just "generate" text. It analyzes your project’s cognitive current to suggest ideas and structures that align perfectly with your expert voice.</p>
                </div>
                <div className="@xl:grid-cols-3 mt-12 grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3 border-t pt-6">
                        <Lightbulb className="text-muted-foreground size-4" />
                        <p className="text-muted-foreground leading-5">
                            <span className="text-foreground font-medium">Idea Architecture</span> Spark deep-work cycles with AI-powered suggestions rooted in your unique project context and historical data.
                        </p>
                    </div>

                    <div className="space-y-3 border-t pt-6">
                        <Pencil className="text-muted-foreground size-4" />
                        <p className="text-muted-foreground leading-5">
                            <span className="text-foreground font-medium">Flow Refinement</span> Eliminate friction in your drafts with style refinements that maintain professional authority while maximizing clarity.
                        </p>
                    </div>

                    <div className="space-y-3 border-t pt-6">
                        <PencilRuler className="text-muted-foreground size-4" />
                        <p className="text-muted-foreground leading-5">
                            <span className="text-foreground font-medium">Spatial Mapping</span> Transform raw thoughts into visually structured layouts designed to guide your audience through your unbroken flow.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
