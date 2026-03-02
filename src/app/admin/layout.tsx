"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRbacStore } from "@/store/rbac-store";
import { useActivityStore } from "@/store/activity-store";
import { useThemeStore } from "@/store/theme-store";
import { getRoleBadgeColor, getRoleLabel } from "@/lib/auth";
import {
    LayoutDashboard, BookOpen, Users, Newspaper, MessageSquareQuote,
    Settings, LogOut, Menu, X, ChevronRight, Sparkles, History, ShieldCheck,
    Sun, Moon,
} from "lucide-react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/instructors", label: "Instructors", icon: Users },
    { href: "/admin/blogs", label: "Blog Posts", icon: Newspaper },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { href: "/admin/settings", label: "Contact Info", icon: Settings },
];

const adminNavItems = [
    { href: "/admin/users", label: "User Management", icon: ShieldCheck, permission: "manage_users" as const },
    { href: "/admin/history", label: "Activity History", icon: History },
];

function SidebarNav({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, can } = useRbacStore();
    const logActivity = useActivityStore((s) => s.logActivity);
    const setActivityUser = useActivityStore((s) => s.setCurrentUser);
    const setCurrentUser = useRbacStore((s) => s.setCurrentUser);
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        logActivity({ action: "LOGOUT", entity: "system", details: "Logged out", success: true });
        await fetch("/api/auth/logout", { method: "POST" });
        setCurrentUser(null);
        setActivityUser(null);
        router.push("/admin/login");
    };

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`px-6 py-6 border-b transition-colors ${theme === 'dark' ? 'border-white/[0.06]' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className={`text-sm font-bold tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ORYX Admin</p>
                        <p className={`text-[10px] uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-gray-400 font-semibold'}`}>Control Panel</p>
                    </div>
                </div>
            </div>

            {/* Current user badge */}
            {currentUser && (
                <div className={`mx-3 mt-3 px-3 py-2.5 rounded-xl border transition-all ${theme === 'dark'
                    ? 'bg-white/[0.04] border-white/[0.06]'
                    : 'bg-blue-50/50 border-blue-100/50'}`}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center shrink-0">
                            <span className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-white/70' : 'text-blue-700'}`}>{currentUser.displayName[0]}</span>
                        </div>
                        <div className="min-w-0">
                            <p className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-white/80' : 'text-gray-800'}`}>{currentUser.displayName}</p>
                            <span className={`inline-flex text-[9px] font-bold uppercase tracking-wider border px-1.5 py-px rounded-full mt-0.5 ${getRoleBadgeColor(currentUser.role)}`}>
                                {getRoleLabel(currentUser.role)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {/* Content section */}
                <p className={`text-[9px] uppercase tracking-widest font-bold px-3 mb-2 transition-colors ${theme === 'dark' ? 'text-white/20' : 'text-gray-400'}`}>Content</p>
                {navItems.map((item) => {
                    const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    // Hydration fix: Only filter after mounting
                    if (mounted && can("read") === false) return null;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                ? (theme === 'dark' ? "bg-white/10 text-white shadow-sm" : "bg-blue-600 text-white shadow-md shadow-blue-200")
                                : (theme === 'dark' ? "text-white/50 hover:text-white hover:bg-white/[0.06]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")
                                }`}
                        >
                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? (theme === 'dark' ? "text-blue-400" : "text-white") : ""}`} />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight className={`w-3 h-3 transition-colors ${theme === 'dark' ? "text-blue-400/70" : "text-white/70"}`} />}
                        </Link>
                    );
                })}

                {/* Admin section */}
                <p className={`text-[9px] uppercase tracking-widest font-bold px-3 mt-4 mb-2 transition-colors ${theme === 'dark' ? 'text-white/20' : 'text-gray-400'}`}>Administration</p>
                {adminNavItems.map((item) => {
                    // Hide user management from non-super-admins
                    // Hydration fix: Only filter after mounting
                    if (mounted && item.permission === "manage_users" && !can("manage_users")) return null;

                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                ? (theme === 'dark' ? "bg-white/10 text-white shadow-sm" : "bg-amber-500 text-white shadow-md shadow-amber-100")
                                : (theme === 'dark' ? "text-white/50 hover:text-white hover:bg-white/[0.06]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")
                                }`}
                        >
                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? (theme === 'dark' ? "text-amber-400" : "text-white") : ""}`} />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight className={`w-3 h-3 transition-colors ${theme === 'dark' ? "text-amber-400/70" : "text-white/70"}`} />}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className={`px-3 pb-5 border-t pt-4 transition-colors ${theme === 'dark' ? 'border-white/[0.06]' : 'border-gray-100'}`}>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${theme === 'dark'
                        ? 'text-white/40 hover:text-red-400 hover:bg-red-400/10'
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}

const allNavItems = [...navItems, ...adminNavItems];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const currentPage = allNavItems.find((i) =>
        "exact" in i && i.exact ? pathname === i.href : pathname.startsWith(i.href)
    );

    const fetchRoles = useRbacStore((s) => s.fetchRoles);

    useEffect(() => {
        setSidebarOpen(false);
        fetchRoles();
    }, [pathname, fetchRoles]);

    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const bgCls = theme === 'dark' ? 'bg-[#080d1a] text-white' : 'bg-gray-50 text-gray-900 font-medium';
    const sidebarBgCls = theme === 'dark' ? 'bg-[#0c1225] border-white/[0.05]' : 'bg-white border-gray-200 shadow-xl';
    const headerBgCls = theme === 'dark' ? 'bg-[#080d1a]/80 border-white/[0.05]' : 'bg-white/80 border-gray-200 shadow-sm';

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${bgCls}`}>
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col w-60 shrink-0 border-r fixed inset-y-0 left-0 z-40 transition-colors duration-300 ${sidebarBgCls}`}>
                <SidebarNav />
            </aside>

            {/* Mobile Sidebar overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className={`relative w-64 border-r flex flex-col shadow-2xl transition-colors duration-300 ${sidebarBgCls}`}>
                        <div className="absolute top-4 right-4">
                            <button onClick={() => setSidebarOpen(false)} className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <SidebarNav onClose={() => setSidebarOpen(false)} />
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:pl-60">
                {/* Top Header */}
                <header className={`sticky top-0 z-30 h-14 flex items-center gap-4 px-6 backdrop-blur border-b transition-colors duration-300 ${headerBgCls}`}>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className={`lg:hidden p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1 className={`text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
                        {currentPage?.label ?? "Admin"}
                    </h1>
                    <div className="ml-auto flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg border transition-all ${theme === 'dark'
                                ? 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>
                        <Link
                            href="/"
                            target="_blank"
                            className={`text-xs font-semibold py-1.5 px-3 rounded-lg border border-blue-100/50 bg-blue-50/30 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white transition-all`}
                        >
                            View Live Site ↗
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
