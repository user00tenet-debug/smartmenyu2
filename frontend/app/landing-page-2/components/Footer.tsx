export default function Footer() {
    const links = [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <footer className="bg-alabaster border-t border-warm-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
                    {/* Logo & Tagline */}
                    <div>
                        <span className="text-2xl font-bold font-heading text-warm-900 tracking-tight">
                            MENYU
                        </span>
                        <p className="mt-3 text-sm text-mutedgray leading-relaxed max-w-xs">
                            The smart QR menu platform for modern Indian restaurants. Scan,
                            browse, order, and pay — all from one system.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-mutedgray hover:text-warm-900 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-4">
                            Contact
                        </h4>
                        <a
                            href="mailto:smartmenyu@gmail.com"
                            className="text-sm text-mutedgray hover:text-warm-900 transition-colors duration-200"
                        >
                            smartmenyu@gmail.com
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-warm-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-mutedgray/70">
                        © 2026 Menyu. All rights reserved.
                    </p>
                    <p className="text-xs text-mutedgray/70">
                        Made with ❤️ for Indian restaurants
                    </p>
                </div>
            </div>
        </footer>
    );
}
