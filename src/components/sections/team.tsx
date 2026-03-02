"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAdminStore } from "@/store/admin-store";
import { type Instructor } from "@/lib/api";
import Image from "next/image";

function InstructorCard({ instructor, index }: { instructor: Instructor; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100 dark:bg-brand-900/50">
                <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                            {instructor.name}
                        </h3>
                        <p className="text-sm text-brand-600 dark:text-brand-400 font-medium">
                            {instructor.role}
                        </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                        {instructor.experience}
                    </span>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed line-clamp-3">
                    {instructor.bio}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                    {instructor.expertise.map((skill, i) => (
                        <span
                            key={i}
                            className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export function TeamSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const instructors = useAdminStore((s) => s.instructors);
    const isLoading = false;

    return (
        <section
            id="team"
            className="relative py-24 bg-white dark:bg-brand-950 overflow-hidden"
        >
            {/* Background accents */}
            <div className="absolute top-0 right-0 w-1/2 h-px bg-gradient-to-l from-brand-300/50 dark:from-brand-500/20 to-transparent" />
            <div className="absolute -left-40 top-40 w-96 h-96 bg-brand-50 dark:bg-brand-800/10 rounded-full blur-[100px]" />

            <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400 rounded-full border border-brand-300 dark:border-brand-400/30 mb-4">
                        Our Instructors
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 dark:text-white">
                        Learn From The Experts
                    </h2>
                    <p className="mt-4 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400 mx-auto">
                        Our faculty consists of industry veterans from 5-star hotels and leading international cruise lines.
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 dark:border-brand-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 hover:gap-8 transition-all duration-500">
                        {instructors.map((instructor, i) => (
                            <InstructorCard key={instructor.id} instructor={instructor} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
