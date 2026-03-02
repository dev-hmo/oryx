"use client";

import React, { useState, useMemo } from "react";
import { useActivityStore } from "@/store/activity-store";
import {
    ACTION_TYPES, ENTITY_TYPES, ROLES,
    type ActivityFilter, type ActionType, type EntityType, type Role
} from "@/lib/schemas";
import { getRoleBadgeColor, getRoleLabel } from "@/lib/auth";
import {
    History, Search, Filter, X, Download, Trash2, ChevronDown,
    CheckCircle, XCircle, RefreshCw, Shield
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true,
    });
}

function ActionBadge({ action }: { action: ActionType }) {
    const styles: Record<ActionType, string> = {
        LOGIN: "bg-blue-500/15 text-blue-400",
        LOGOUT: "bg-slate-500/15 text-slate-400",
        CREATE: "bg-emerald-500/15 text-emerald-400",
        UPDATE: "bg-amber-500/15 text-amber-400",
        DELETE: "bg-red-500/15 text-red-400",
        VIEW: "bg-purple-500/15 text-purple-400",
        EXPORT: "bg-cyan-500/15 text-cyan-400",
    };
    return (
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[action]}`}>
            {action}
        </span>
    );
}

function EntityBadge({ entity }: { entity: EntityType }) {
    return (
        <span className="text-[10px] font-mono text-white/40 bg-white/[0.04] px-2 py-0.5 rounded">
            {entity}
        </span>
    );
}

const selectCls = "h-9 px-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/80 text-xs focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer";
const inputCls = "h-9 px-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/80 text-xs placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-all";

function Modal({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white dark:bg-[#0f1628] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-colors">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] bg-white dark:bg-[#0f1628] transition-colors">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HistoryPage() {
    const { logs, getFilteredLogs, clearLogs } = useActivityStore();

    const [filter, setFilter] = useState<ActivityFilter>({});
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const PER_PAGE = 25;

    const setF = (key: keyof ActivityFilter, val: string) => {
        setFilter((prev) => ({ ...prev, [key]: val || undefined }));
        setPage(1);
    };

    const clearFilters = () => { setFilter({}); setPage(1); };

    const filtered = useMemo(() => getFilteredLogs(filter), [filter, logs]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const activeFilterCount = Object.values(filter).filter(Boolean).length;

    const handleExport = () => {
        const csv = [
            ["Timestamp", "User", "Role", "Action", "Entity", "Entity Title", "Details", "Success"].join(","),
            ...filtered.map((l) => [
                l.timestamp, l.username, l.role, l.action, l.entity,
                l.entityTitle ?? "", l.details ?? "", l.success
            ].map((v) => `"${v}"`).join(",")),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `oryx-activity-${Date.now()}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <History className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity History</h2>
                        <p className="text-sm text-gray-400 dark:text-white/40">
                            {filtered.length} events · {logs.length} total
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters((p) => !p)}
                        className={`flex items-center gap-2 h-9 px-4 rounded-xl border text-sm font-medium transition-all ${showFilters || activeFilterCount > 0
                            ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                            : "border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={filtered.length === 0}
                        className="flex items-center gap-2 h-9 px-4 rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/50 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/30 text-sm transition-all disabled:opacity-40"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="flex items-center gap-2 h-9 px-4 rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/50 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/30 text-sm transition-all shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" /> Clear
                    </button>
                </div>
            </div>

            {/* Clear Confirmation Modal */}
            <Modal
                open={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                title="Clear Activity Logs"
            >
                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-900 dark:text-white font-bold">Clear All History?</p>
                            <p className="text-xs text-gray-500 dark:text-white/40 mt-1 leading-relaxed">
                                Are you sure you want to permanently clear all activity logs? This action cannot be undone and you will lose the entire audit trail.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { clearLogs(); setShowClearConfirm(false); }}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all shadow-lg shadow-red-500/20"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Everything
                        </button>
                        <button
                            onClick={() => setShowClearConfirm(false)}
                            className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Logins", value: logs.filter((l) => l.action === "LOGIN").length, color: "text-blue-500 dark:text-blue-400" },
                    { label: "Creates", value: logs.filter((l) => l.action === "CREATE").length, color: "text-emerald-500 dark:text-emerald-400" },
                    { label: "Updates", value: logs.filter((l) => l.action === "UPDATE").length, color: "text-amber-500 dark:text-amber-400" },
                    { label: "Deletes", value: logs.filter((l) => l.action === "DELETE").length, color: "text-red-500 dark:text-red-400" },
                ].map((s) => (
                    <div key={s.label} className="admin-card !p-4">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5 font-medium uppercase tracking-wider">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter panel */}
            {showFilters && (
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Filter className="w-4 h-4 text-white/40" /> Filter Events
                        </h3>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                                <X className="w-3.5 h-3.5" /> Clear all
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div className="relative">
                            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-wider">Search</label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                                <input
                                    className={`${inputCls} pl-8 w-full`}
                                    placeholder="user, entity..."
                                    value={filter.search ?? ""}
                                    onChange={(e) => setF("search", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-wider">Action</label>
                            <select className={`${selectCls} w-full`} value={filter.action ?? ""} onChange={(e) => setF("action", e.target.value)}>
                                <option value="">All Actions</option>
                                {ACTION_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-wider">Entity</label>
                            <select className={`${selectCls} w-full`} value={filter.entity ?? ""} onChange={(e) => setF("entity", e.target.value)}>
                                <option value="">All Entities</option>
                                {ENTITY_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-wider">Role</label>
                            <select className={`${selectCls} w-full`} value={filter.role ?? ""} onChange={(e) => setF("role", e.target.value)}>
                                <option value="">All Roles</option>
                                {ROLES.map((r) => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-wider">From</label>
                            <input type="date" className={`${inputCls} w-full`} value={filter.dateFrom ?? ""} onChange={(e) => setF("dateFrom", e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-wider">To</label>
                            <input type="date" className={`${inputCls} w-full`} value={filter.dateTo ?? ""} onChange={(e) => setF("dateTo", e.target.value)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Logs table */}
            {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <History className="w-10 h-10 text-white/10 mb-3" />
                    <p className="text-white/30 text-sm">No activity logs found</p>
                    {activeFilterCount > 0 && (
                        <button onClick={clearFilters} className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Time</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">User</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Action</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Entity</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">Details</th>
                                <th className="px-4 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {paginated.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3.5">
                                        <p className="text-xs text-white/60 whitespace-nowrap">{formatTime(log.timestamp)}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                                                <span className="text-[9px] font-bold text-white/60 uppercase">{log.displayName[0]}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-white/80">{log.displayName}</p>
                                                <span className={`text-[9px] font-semibold uppercase tracking-wider border px-1.5 py-px rounded-full ${getRoleBadgeColor(log.role)}`}>
                                                    {log.role === "super_admin" ? "SA" : log.role[0].toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <ActionBadge action={log.action} />
                                    </td>
                                    <td className="px-4 py-3.5 hidden md:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <EntityBadge entity={log.entity} />
                                            {log.entityTitle && (
                                                <p className="text-[10px] text-white/40 truncate max-w-[140px]">{log.entityTitle}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 hidden lg:table-cell">
                                        <p className="text-xs text-white/30 truncate max-w-[200px]">{log.details ?? "—"}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        {log.success
                                            ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                                            : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04] bg-white/[0.02]">
                            <p className="text-xs text-white/30">
                                {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-7 px-3 rounded-lg text-xs text-white/50 hover:text-white border border-white/[0.06] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Prev
                                </button>
                                <span className="text-xs text-white/30">{page} / {totalPages}</span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="h-7 px-3 rounded-lg text-xs text-white/50 hover:text-white border border-white/[0.06] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
