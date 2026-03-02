"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { useAdminStore } from "@/store/admin-store";

export function TestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const testimonials = useAdminStore((s) => s.testimonials);

    return (
        <section
            id="testimonials"
            className="relative py-24 bg-white dark:bg-[#060c1a] overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-300/30 dark:via-brand-500/20 to-transparent" />
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-100/30 dark:bg-brand-600/5 rounded-full blur-[120px]" />

            <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400 rounded-full border border-brand-300 dark:border-brand-400/30 mb-4">
                        Success Stories
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 dark:text-white">
                        Graduates Who Made It
                    </h2>
                    <p className="mt-4 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400 mx-auto">
                        Our alumni are now thriving in top hotels and cruise lines around the
                        world.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="rounded-xl"
                >
                    <InfiniteMovingCards
                        items={testimonials}
                        direction="right"
                        speed="slow"
                    />
                </motion.div>
            </div>
        </section>
    );
}
