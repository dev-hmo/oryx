"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
    { href: "#features", label: "Why ORYX" },
    { href: "#courses", label: "Programs" },
    { href: "#testimonials", label: "Stories" },
    { href: "#contact", label: "Contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white/90 dark:bg-brand-950/90 backdrop-blur-xl border-b border-neutral-200 dark:border-white/5 shadow-lg shadow-neutral-200/50 dark:shadow-brand-950/50"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Image
                            src="/oryx-logo.png"
                            alt="ORYX"
                            width={36}
                            height={36}
                            className="rounded-lg"
                        />
                        <span className="font-bold text-lg tracking-[0.2em] text-brand-900 dark:text-white">
                            ORYX
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-brand-700 dark:hover:text-white rounded-lg hover:bg-brand-50 dark:hover:bg-white/5 transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <ThemeToggle />
                        <a
                            href="#contact"
                            className="ml-3 px-5 py-2 text-sm font-semibold rounded-full bg-brand-600 text-white hover:bg-brand-500 transition-colors shadow-lg shadow-brand-600/20"
                        >
                            Apply Now
                        </a>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-neutral-600 dark:text-neutral-300 hover:text-brand-700 dark:hover:text-white p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-white/5"
                        >
                            {isOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 dark:bg-brand-950/95 backdrop-blur-xl border-b border-neutral-200 dark:border-white/5"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-brand-700 dark:hover:text-white hover:bg-brand-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a
                                href="#contact"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center mt-3 px-5 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-500 transition-colors"
                            >
                                Apply Now
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
