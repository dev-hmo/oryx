"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { useAdminStore } from "@/store/admin-store";

export function ContactSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const contactInfo = useAdminStore((s) => s.contactInfo);

    return (
        <section
            id="contact"
            className="relative py-24 bg-gradient-to-b from-brand-50 via-brand-100/30 to-white dark:from-transparent dark:via-transparent dark:to-transparent dark:mesh-gradient overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-300/30 dark:via-brand-500/20 to-transparent" />

            <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400 rounded-full border border-brand-300 dark:border-brand-400/30 mb-4">
                        Get Started
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 dark:text-white">
                        Enroll Today
                    </h2>
                    <p className="mt-4 max-w-xl text-lg text-neutral-500 dark:text-neutral-400 mx-auto">
                        Seats are limited. Contact us now to reserve your spot in the next
                        batch.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone & Messaging */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="rounded-2xl p-8 space-y-6 bg-white dark:bg-white/5 border border-brand-100 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-sm"
                    >
                        <h3 className="text-xl font-semibold text-brand-900 dark:text-white flex items-center gap-2">
                            <Phone className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                            Contact Us
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                                    Phone
                                </p>
                                <div className="space-y-1.5">
                                    {contactInfo.phones.map((phone, i) => (
                                        <a
                                            key={i}
                                            href={`tel:${phone.replace(/\s/g, "")}`}
                                            className="block text-lg text-brand-700 dark:text-brand-300 hover:text-brand-500 dark:hover:text-brand-200 transition-colors font-medium"
                                        >
                                            📞 {phone}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                                    Viber & WhatsApp
                                </p>
                                <a
                                    href={`https://wa.me/${contactInfo.whatsapp.replace(/[+\s]/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-lg text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors font-medium"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    {contactInfo.viber}
                                </a>
                            </div>
                        </div>

                        <a
                            href={`https://wa.me/${contactInfo.whatsapp.replace(/[+\s]/g, "")}?text=Hello%20ORYX,%20I%20would%20like%20to%20enroll`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                        >
                            💬 Message on WhatsApp
                        </a>
                    </motion.div>

                    {/* Addresses */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="rounded-2xl p-8 space-y-6 bg-white dark:bg-white/5 border border-brand-100 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-sm"
                    >
                        <h3 className="text-xl font-semibold text-brand-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                            Our Campuses
                        </h3>

                        <div className="space-y-5">
                            {contactInfo.addresses.map((address, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-brand-200 dark:bg-brand-500/30 border border-brand-400" />
                                    <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                                        Campus {i + 1}
                                    </p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                        {address}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <a
                            href="#courses"
                            className="block w-full text-center px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
                        >
                            📋 View All Programs
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
