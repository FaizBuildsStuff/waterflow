import Image from 'next/image'

const testimonials = [
    {
        avatar: 'https://avatars.githubusercontent.com/u/47919550?v=4',
        name: 'Meschac Irung',
        role: 'Frontend Lead',
        quote: 'Anthryve is extraordinary. It eliminates the cognitive load of project planning. A real gold mine for deep work.',
    },
    {
        avatar: 'https://avatars.githubusercontent.com/u/68236786?v=4',
        name: 'Theo Balick',
        role: 'Founder, CEO',
        quote: 'Finally, a tool that respects my focus. The AI decomposition is pure magic for our quarterly roadmaps.',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        name: 'Sarah Johnson',
        role: 'DevOps Architect',
        quote: 'The automated follow-ups and sync digests have saved us hours of meeting fatigue. It just flows.',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        name: 'Aisha Patel',
        role: 'Data Scientist',
        quote: 'Architecture that thinks with you. Anthryve is the infrastructure every high-growth team needs.',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        name: 'Jake Ward',
        role: 'Content Strategist',
        quote: 'The most fluid productivity engine I have ever used. It actually protects your cognitive energy.',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
        name: 'Elena Rossi',
        role: 'Product Designer',
        quote: 'Beautifully designed and incredibly fast. It makes synchronizing cross-functional teams a total breeze.',
    }
];
export default function Testimonials() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div className="space-y-4">
                    <h2 className="text-balance font-serif text-4xl font-medium">What Our Customers Say</h2>
                    <p className="text-muted-foreground text-balance">Hear from the teams and individuals who have transformed their workflow with our platform.</p>
                </div>
                <div className="@xl:grid-cols-2 mt-12 grid gap-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-card ring-border text-foreground space-y-3 rounded-2xl p-4 text-sm ring-1">
                            <div className="flex gap-3">
                                <div className="before:border-foreground/10 relative size-5 shrink-0 rounded-full before:absolute before:inset-0 before:rounded-full before:border">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="rounded-full object-cover"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                <p className="text-sm font-medium">
                                    {testimonial.name} <span className="text-muted-foreground ml-2 font-normal">{testimonial.role}</span>
                                </p>
                            </div>

                            <p className="text-muted-foreground text-sm">{testimonial.quote}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
