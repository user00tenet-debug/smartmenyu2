export default function EInvoice() {
    const highlights = [
        {
            title: "Environment Friendly",
            description: "Digital invoices reduce paper usage and support eco-friendly practices."
        },
        {
            title: "No Billing Hardware Needed",
            description: "Restaurants do not need printers or billing machines to generate invoices."
        },
        {
            title: "Reduce Paper and Printing Costs",
            description: "Eliminates the cost of paper rolls and printer maintenance."
        },
        {
            title: "Simpler Operations",
            description: "Staff do not need to manage printers or printed receipts."
        }
    ];

    return (
        <section className="py-20 lg:py-32 relative bg-white overflow-hidden border-t border-warm-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-start">
                    {/* Right Side — Text Content */}
                    <div className="lg:w-1/2" data-animate>
                        <p className="inline-block text-sm font-bold tracking-widest uppercase text-gold-600 bg-gold-50 px-4 py-1.5 rounded-full mb-4">
                            Digital Invoicing
                        </p>

                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-warm-900 mb-6 tracking-tight">
                            E-Invoice{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-gold-500">
                                (Digital Invoice on WhatsApp)
                            </span>
                        </h2>

                        <div className="space-y-6">
                            {highlights.map((item) => (
                                <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-alabaster border border-transparent hover:border-warm-100 group">
                                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h4 className="text-lg font-bold text-warm-900 mb-1">{item.title}</h4>
                                        <p className="text-mutedgray leading-relaxed text-sm sm:text-base">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Left Side — Image Placeholder */}
                    <div className="lg:w-1/2" data-animate>
                        <div className="rounded-3xl overflow-hidden shadow-lg border border-warm-200/60 transition-all duration-300 hover:shadow-xl hover:border-gold-200 bg-alabaster">
                            <img
                                src={`/landing/sections/einvoice/1.png`}
                                alt={`E-Invoice on WhatsApp`}
                                className="w-full aspect-[4/3] object-contain p-4"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
