import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="relative bg-neutral-50 dark:bg-brand-950 border-t border-neutral-200 dark:border-white/5">
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/oryx-logo.png"
                                alt="ORYX"
                                width={44}
                                height={44}
                                className="rounded-lg"
                            />
                            <div>
                                <span className="font-bold text-lg tracking-[0.2em] text-brand-900 dark:text-white block">
                                    ORYX
                                </span>
                                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 tracking-wide">
                                    Hospitality & Cruise Shipping Training
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
                            Empowering careers in global hospitality and cruise ship operations
                            through world-class training. Based in Yangon, Myanmar.
                        </p>
                    </div>

                    {/* Programs */}
                    <div>
                        <h3 className="text-xs font-semibold text-brand-600 dark:text-brand-400 tracking-wider uppercase mb-4">
                            Programs
                        </h3>
                        <ul className="space-y-2.5">
                            {[
                                "Food & Beverage",
                                "Chef / Food Production",
                                "Cruise Ship Career",
                                "Hotel Operation",
                                "Galley Utility",
                                "Housekeeping",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#courses"
                                        className="text-sm text-neutral-500 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-xs font-semibold text-brand-600 dark:text-brand-400 tracking-wider uppercase mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: "Why ORYX", href: "#features" },
                                { label: "Success Stories", href: "#testimonials" },
                                { label: "Enroll Now", href: "#contact" },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        className="text-sm text-neutral-500 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-neutral-400 dark:text-neutral-600">
                        © {new Date().getFullYear()} ORYX Hospitality & Cruise Shipping
                        Training Center. All rights reserved.
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-600">
                        Yangon, Myanmar 🇲🇲
                    </p>
                </div>
            </div>
        </footer>
    );
}
