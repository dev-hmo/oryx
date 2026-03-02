"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useActivityStore } from "@/store/activity-store";
import { useRbacStore } from "@/store/rbac-store";
import { Eye, EyeOff, Sparkles, AlertCircle, Shield, Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const router = useRouter();

    const setCurrentUser = useRbacStore((s) => s.setCurrentUser);
    const setActivityUser = useActivityStore((s) => s.setCurrentUser);
    const logActivity = useActivityStore((s) => s.logActivity);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Set in-memory user context (RBAC + activity stores)
                const user = data.user;
                const sessionUser = {
                    id: user.id,
                    username: user.username,
                    displayName: user.displayName,
                    role: user.role,
                    createdAt: new Date().toISOString(),
                    lastLoginAt: new Date().toISOString(),
                    isActive: true,
                };
                setCurrentUser(sessionUser);
                setActivityUser(user);

                // Log the login event
                logActivity({
                    action: "LOGIN",
                    entity: "system",
                    details: `Logged in as ${user.roleLabel}`,
                    success: true,
                });

                router.push("/admin");
            } else {
                setAttempts((prev) => prev + 1);
                setError(data.error ?? "Login failed.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isLocked = attempts >= 5;

    return (
        <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4">
            {/* Background glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] bg-violet-600/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Security badge */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400/80 font-medium tracking-wider uppercase">
                        Military-Grade Secured
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/50">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white">ORYX Admin</h1>
                        <p className="text-sm text-white/40 mt-1">Secure Control Panel</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                                placeholder="Username"
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                required
                                autoComplete="username"
                                disabled={isLocked || loading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                    required
                                    autoComplete="current-password"
                                    disabled={isLocked || loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Attempts warning */}
                        {attempts > 0 && attempts < 5 && (
                            <div className="text-[11px] text-amber-400/80">
                                {5 - attempts} attempt{5 - attempts !== 1 ? "s" : ""} remaining before lockout
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || isLocked || !username || !password}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating…</>
                            ) : isLocked ? (
                                "Account Locked"
                            ) : (
                                "Sign In Securely"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-white/20 mt-4">
                    ORYX Training Center • Admin Panel
                </p>
            </div>
        </div>
    );
}
