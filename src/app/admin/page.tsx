"use client";

import React from "react";
import Link from "next/link";
import { useAdminStore } from "@/store/admin-store";
import { useRbacStore } from "@/store/rbac-store";
import { useActivityStore } from "@/store/activity-store";
import { getRoleBadgeColor, getRoleLabel } from "@/lib/auth";
import {
    BookOpen, Users, Newspaper, MessageSquareQuote,
    TrendingUp, ArrowRight, Sparkles, Phone, History,
    Shield, CheckCircle, XCircle
} from "lucide-react";

function StatCard({
    icon: Icon, label, value, href, color,
}: {
    icon: React.ElementType; label: string; value: number; href: string; color: string;
}) {
    return (
        <Link
            href={href}
            className="group relative rounded-2xl p-6 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 flex items-center gap-5"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-white/40 mt-0.5">{label}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
        </Link>
    );
}

function actionColor(action: string): string {
    const m: Record<string, string> = {
        LOGIN: "text-blue-400", LOGOUT: "text-slate-400", CREATE: "text-emerald-400",
        UPDATE: "text-amber-400", DELETE: "text-red-400", VIEW: "text-purple-400",
    };
    return m[action] ?? "text-white/40";
}

export default function AdminDashboard() {
    const courses = useAdminStore((s) => s.courses);
    const instructors = useAdminStore((s) => s.instructors);
    const blogs = useAdminStore((s) => s.blogs);
    const testimonials = useAdminStore((s) => s.testimonials);
    const { currentUser, can } = useRbacStore();
    const { logs } = useActivityStore();

    const stats = [
        { icon: BookOpen, label: "Courses", value: courses.length, href: "/admin/courses", color: "bg-blue-500/20 text-blue-400" },
        { icon: Users, label: "Instructors", value: instructors.length, href: "/admin/instructors", color: "bg-emerald-500/20 text-emerald-400" },
        { icon: Newspaper, label: "Blog Posts", value: blogs.length, href: "/admin/blogs", color: "bg-amber-500/20 text-amber-400" },
        { icon: MessageSquareQuote, label: "Testimonials", value: testimonials.length, href: "/admin/testimonials", color: "bg-purple-500/20 text-purple-400" },
    ];

    const quickLinks = [
        { href: "/admin/courses", label: "Manage Courses", icon: BookOpen },
        { href: "/admin/instructors", label: "Manage Instructors", icon: Users },
        { href: "/admin/blogs", label: "Manage Blog", icon: Newspaper },
        { href: "/admin/testimonials", label: "Manage Testimonials", icon: MessageSquareQuote },
        { href: "/admin/settings", label: "Contact Settings", icon: Phone },
        { href: "/admin/history", label: "Activity History", icon: History },
    ];

    const recentLogs = logs.slice(0, 8);

    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold text-white">
                            Welcome back{currentUser ? `, ${currentUser.displayName}` : ""}!
                        </h2>
                        {currentUser && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${getRoleBadgeColor(currentUser.role)}`}>
                                {getRoleLabel(currentUser.role)}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-white/40">Here&apos;s what&apos;s happening with your content.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400/70">Secured</span>
                </div>
            </div>

            {/* Stats grid */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-white/40" />
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Content Overview</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {stats.map((s) => <StatCard key={s.href} {...s} />)}
                </div>
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Links */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-0.5">
                        {quickLinks
                            .filter((l) => l.href !== "/admin/users" || can("manage_users"))
                            .map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-all group"
                                    >
                                        <Icon className="w-4 h-4 text-blue-400/60 group-hover:text-blue-400" />
                                        {link.label}
                                        <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                );
                            })}
                    </div>
                </div>

                {/* Recent Courses */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white">Recent Courses</h3>
                        <Link href="/admin/courses" className="text-xs text-blue-400 hover:text-blue-300">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {courses.slice(0, 4).map((course) => (
                            <div key={course.id} className="flex items-center gap-3">
                                <span className="text-xl">{course.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white/80 truncate font-medium">{course.title}</p>
                                    <p className="text-xs text-white/30">{course.duration} · {course.fee}</p>
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold
                                    ${course.category === "hospitality" ? "bg-amber-500/15 text-amber-400" :
                                        course.category === "culinary" ? "bg-emerald-500/15 text-emerald-400" :
                                            course.category === "maritime" ? "bg-cyan-500/15 text-cyan-400" :
                                                "bg-purple-500/15 text-purple-400"}`}>
                                    {course.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <History className="w-4 h-4 text-amber-400" /> Recent Activity
                        </h3>
                        <Link href="/admin/history" className="text-xs text-blue-400 hover:text-blue-300">View all</Link>
                    </div>
                    {recentLogs.length === 0 ? (
                        <p className="text-xs text-white/30 text-center py-6">No activity yet. Start managing content!</p>
                    ) : (
                        <div className="space-y-2.5">
                            {recentLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-2.5">
                                    <div className="mt-0.5">
                                        {log.success
                                            ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400/60" />
                                            : <XCircle className="w-3.5 h-3.5 text-red-400/60" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-white/70 truncate">
                                            <span className={`font-semibold ${actionColor(log.action)}`}>{log.action}</span>
                                            {" "}{log.entity}{log.entityTitle ? ` · ${log.entityTitle}` : ""}
                                        </p>
                                        <p className="text-[10px] text-white/25">
                                            {log.displayName} · {new Date(log.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
