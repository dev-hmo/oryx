"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs, type BlogPost } from "@/lib/api";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
        >
            <div className="aspect-[16/10] relative overflow-hidden bg-neutral-100 dark:bg-brand-900/50">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/90 dark:bg-brand-950/90 text-brand-700 dark:text-brand-300 backdrop-blur-md shadow-sm">
                        {post.category}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors line-clamp-2">
                    <a href="#" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {post.title}
                    </a>
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                </p>

                <div className="mt-auto flex items-center text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                    Read Story
                    <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
}

export function BlogSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: fetchBlogs,
    });

    return (
        <section
            id="blog"
            className="relative py-24 bg-brand-50 dark:bg-[#060c1a] overflow-hidden"
        >
            {/* Background accents */}
            <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-brand-300/50 dark:from-brand-500/20 to-transparent" />
            <div className="absolute -right-40 bottom-40 w-96 h-96 bg-brand-200/20 dark:bg-brand-600/5 rounded-full blur-[100px]" />

            <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
                >
                    <div className="max-w-2xl">
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400 rounded-full border border-brand-300 dark:border-brand-400/30 mb-4">
                            Campus Life
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 dark:text-white">
                            Latest News & Activities
                        </h2>
                        <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">
                            Stay updated with our recent batch placements, hands-on masterclasses, and industry guides.
                        </p>
                    </div>

                    <a
                        href="#"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-brand-200 dark:border-white/10 text-brand-700 dark:text-brand-300 font-semibold hover:bg-brand-50 dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none whitespace-nowrap"
                    >
                        View All News
                    </a>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 dark:border-brand-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {blogs.map((post, i) => (
                            <BlogCard key={post.id} post={post} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
