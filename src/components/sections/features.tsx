"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    Award,
    Briefcase,
    GraduationCap,
    Ship,
    Globe,
    Users,
} from "lucide-react";

const features = [
    {
        icon: <Briefcase className="w-6 h-6" />,
        title: "100% Placement Assistance",
        description:
            "We actively connect graduates with hotels, restaurants, and cruise lines for immediate career opportunities after training.",
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "International Standards",
        description:
            "Curriculum aligned with global 5-star hotel and international cruise line requirements including USPH & HACCP.",
    },
    {
        icon: <GraduationCap className="w-6 h-6" />,
        title: "Expert Instructors",
        description:
            "Learn from Senior Executive Chefs and hospitality professionals with 30+ years of international experience.",
    },
    {
        icon: <Ship className="w-6 h-6" />,
        title: "Cruise Line Preparation",
        description:
            "Specialized training for Royal Caribbean, Princess Cruises, MSC, and other major cruise line careers.",
    },
    {
        icon: <Award className="w-6 h-6" />,
        title: "Certified Qualifications",
        description:
            "Earn professional certificates and STCW preparation recognized by the international maritime and hospitality industry.",
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "On-Campus + Hostel",
        description:
            "Full on-campus training with hostel arrangements available for students traveling from other states and regions.",
    },
];

export function FeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative py-24 bg-white dark:bg-brand-950/50 overflow-hidden">
            {/* Subtle bg decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/5 rounded-full blur-[100px]" />

            <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-brand-400 rounded-full border border-brand-400/30 mb-4">
                        Why ORYX
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 dark:text-white">
                        Your Career Starts Here
                    </h2>
                    <p className="mt-4 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400 mx-auto">
                        Industry-standard training in Yangon, designed to launch your career
                        on land or at sea.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative p-6 rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-brand-50 dark:hover:bg-white/[0.05] transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-brand-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
