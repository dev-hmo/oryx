"use client";
import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses, type Course } from "@/lib/api";
import {
    Calendar,
    Clock,
    Timer,
    Banknote,
    ChevronDown,
    ChevronUp,
    CheckCircle,
} from "lucide-react";

const categoryColors: Record<string, string> = {
    hospitality:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    culinary:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    maritime:
        "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
    operations:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
};

function CourseCard({ course, index }: { course: Course; index: number }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-brand-50 dark:hover:bg-white/[0.04] backdrop-blur-sm transition-all duration-300 overflow-hidden shadow-sm dark:shadow-none hover:shadow-md"
        >
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{course.icon}</span>
                        <div>
                            <h3 className="text-lg font-bold text-brand-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                                {course.subtitle}
                            </p>
                        </div>
                    </div>
                    <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryColors[course.category] ||
                            "bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                            }`}
                    >
                        {course.category}
                    </span>
                </div>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                    {course.description}
                </p>

                {/* Quick info grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                        { icon: <Timer className="w-3.5 h-3.5" />, label: course.duration },
                        {
                            icon: <Banknote className="w-3.5 h-3.5" />,
                            label: course.fee,
                        },
                        {
                            icon: <Calendar className="w-3.5 h-3.5" />,
                            label: course.schedule,
                        },
                        { icon: <Clock className="w-3.5 h-3.5" />, label: course.time },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-white/[0.03] rounded-lg px-3 py-2"
                        >
                            <span className="text-brand-500 dark:text-brand-400">
                                {item.icon}
                            </span>
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* Start date badge */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-brand-600 dark:text-brand-300 font-medium">
                        📅 Starts: {course.startDate}
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 px-2 py-0.5 border border-neutral-200 dark:border-white/5 rounded-md">
                        {course.batch}
                    </span>
                </div>

                {/* Expand toggle */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-brand-500 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 py-2 border-t border-neutral-100 dark:border-white/5 mt-1 transition-colors"
                >
                    {expanded ? "Hide" : "What You'll Learn"}
                    {expanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                    )}
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-3 space-y-2">
                                {course.highlights.map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300"
                                    >
                                        <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                                        {h}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export function CoursesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { data: courses = [], isLoading } = useQuery({
        queryKey: ["courses"],
        queryFn: fetchCourses,
    });

    return (
        <section
            id="courses"
            className="relative py-24 bg-brand-50 dark:bg-brand-950 overflow-hidden"
        >
            {/* BG decorations */}
            <div className="absolute -top-40 right-0 w-96 h-96 bg-brand-200/30 dark:bg-brand-600/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-100/40 dark:bg-brand-500/5 rounded-full blur-[130px]" />

            <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400 rounded-full border border-brand-300 dark:border-brand-400/30 mb-4">
                        Training Programs
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 dark:text-white">
                        Build Your Professional Skills
                    </h2>
                    <p className="mt-4 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400 mx-auto">
                        6 industry-focused programs with real-world training, certified
                        instructors, and placement support.
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 dark:border-brand-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {courses.map((course, i) => (
                            <CourseCard key={course.id} course={course} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
