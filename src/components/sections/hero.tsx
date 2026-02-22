"use client";
import React from "react";
import { Spotlight } from "../ui/spotlight";
import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white dark:from-transparent dark:via-transparent dark:to-transparent dark:mesh-gradient">
            {/* Floating orbs — dark mode only */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200/30 dark:bg-brand-500/20 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-300/20 dark:bg-brand-700/20 rounded-full blur-[120px] animate-float-delay" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-100/30 dark:bg-brand-600/10 rounded-full blur-[150px]" />

            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 hidden dark:block" fill="#3b6fb5" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(43,76,138,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(43,76,138,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(59,111,181,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,111,181,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                >
                    <Image
                        src="/logo.png"
                        alt="ORYX Logo"
                        width={100}
                        height={100}
                        className="mx-auto rounded-xl"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-white/5 border border-brand-200 dark:border-white/10 text-sm text-brand-600 dark:text-brand-300 mb-6"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Now Enrolling — Batch 5 Open
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-tight text-gradient-brand dark:text-gradient"
                >
                    ORYX
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-xl sm:text-2xl md:text-3xl font-medium text-brand-500 dark:text-brand-300/90 mt-2 tracking-wide"
                >
                    Hospitality & Cruise Shipping Training Center
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.65 }}
                    className="mt-6 text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed"
                >
                    Launch your professional career in 5-star hotels, luxury resorts, and
                    international cruise lines. World-class training with 30+ years of
                    industry expertise — based in Yangon, Myanmar.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
                >
                    <a
                        href="#courses"
                        className="group relative px-8 py-3.5 rounded-full bg-brand-600 text-white font-semibold overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(59,111,181,0.4)] hover:bg-brand-500"
                    >
                        <span className="relative z-10">Explore Programs</span>
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-3.5 rounded-full border border-brand-300 dark:border-brand-500/30 text-brand-600 dark:text-brand-300 font-semibold hover:bg-brand-50 dark:hover:bg-white/10 transition-all"
                    >
                        Enroll Now →
                    </a>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="mt-16 sm:mt-20 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                >
                    {[
                        { value: "6+", label: "Programs" },
                        { value: "30+", label: "Years Experience" },
                        { value: "500+", label: "Graduates" },
                        { value: "100%", label: "Placement Support" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="rounded-xl px-4 py-4 text-center bg-white/70 dark:bg-white/5 border border-brand-100 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none"
                        >
                            <div className="text-2xl sm:text-3xl font-bold text-brand-800 dark:text-white">
                                {stat.value}
                            </div>
                            <div className="text-xs sm:text-sm text-brand-500/70 dark:text-brand-300/70 mt-1">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
