import { PageHero } from "@/components/page-hero";
import { VisualSection, BentoGrid } from "@/components/page-sections";
import { 
    Carousel, 
    CarouselContent, 
    CarouselItem, 
    CarouselNext, 
    CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function AnthryveFuturesPage() {
    return (
        <main>
            <PageHero 
                subtitle="Innovations"
                title="Engineering the Next Decade"
                description="Explore the R&D projects and long-term vision of Anthryve. We are pushing the boundaries of autonomous creativity and machine perception."
            />

            <VisualSection 
                subtitle="Research Lab"
                title="Autonomous Storytelling"
                description="Our Futures lab is currently developing the first self-correcting creative engine. Imagine a production workflow that learns from audience engagement in real-time and recreates itself to maximize impact."
                image="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop"
            />

            <section className="py-24 bg-zinc-950 text-white overflow-hidden">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">Concept Gallery</span>
                        <h2 className="mt-4 text-4xl font-serif font-medium tracking-tight">Visions of 2030</h2>
                    </div>

                    <div className="relative px-12">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {[
                                    {
                                        title: "Neural Color Grading",
                                        desc: "Real-time emotional tone mapping based on viewer biometrics.",
                                        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
                                    },
                                    {
                                        title: "Holographic Canvas",
                                        desc: "Production environments designed for spatial computing interfaces.",
                                        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
                                    },
                                    {
                                        title: "Quantum Rendering",
                                        desc: "Instantaneous path-tracing for infinite complex environments.",
                                        image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800&auto=format&fit=crop"
                                    },
                                    {
                                        title: "Bio-Adaptive Sound",
                                        desc: "Audio that self-adjusts to the listener's heart rate.",
                                        image: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=800&auto=format&fit=crop"
                                    }
                                ].map((item, index) => (
                                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                        <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm group">
                                            <CardContent className="p-0">
                                                <div className="aspect-[4/5] overflow-hidden">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
                            <CarouselNext className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
                        </Carousel>
                    </div>
                </div>
            </section>
        </main>
    );
}
