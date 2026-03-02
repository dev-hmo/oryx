"use client";

import React, { useState } from "react";
import { useTestimonials, useAddTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/use-content";
import { useActivityStore } from "@/store/activity-store";
import { useRbacStore } from "@/store/rbac-store";
import { useThemeStore } from "@/store/theme-store";
import { type Testimonial } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Save, Quote, ShieldAlert, Loader2, AlertCircle } from "lucide-react";

const EMPTY_TESTIMONIAL: Testimonial = { id: "", quote: "", name: "", title: "" };

const inputCls = "admin-input";
const labelCls = "block text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1.5";

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white dark:bg-[#0f1628] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto transition-colors">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] sticky top-0 bg-white dark:bg-[#0f1628] z-10 transition-colors">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            {children}
        </div>
    );
}

function TestimonialForm({
    initial,
    onSave,
    onCancel,
    isSubmitting = false,
}: {
    initial: Testimonial;
    onSave: (t: Testimonial) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}) {
    const [form, setForm] = useState(initial);
    const set = (k: keyof Testimonial, v: string) => setForm((p: Testimonial) => ({ ...p, [k]: v }));
    const handleSave = () => {
        if (!form.name || !form.id) return;
        onSave(form);
    };

    return (
        <div className="space-y-4">
            <Field label="ID *"><input className={inputCls} value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="testimonial-6" disabled={isSubmitting} /></Field>
            <Field label="Quote *">
                <textarea className={`${inputCls} resize-none h-28`} value={form.quote} onChange={(e) => set("quote", e.target.value)} placeholder="What the graduate said..." disabled={isSubmitting} />
            </Field>
            <Field label="Name *"><input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="John Smith" disabled={isSubmitting} /></Field>
            <Field label="Title / Position"><input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Cabin Steward, MSC Cruises" disabled={isSubmitting} /></Field>
            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="admin-btn-primary flex-1 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                </button>
                <button onClick={onCancel} className="admin-btn-secondary" disabled={isSubmitting}>Cancel</button>
            </div>
        </div>
    );
}

export default function TestimonialsAdmin() {
    const { data: testimonials = [], isLoading, isError } = useTestimonials();
    const addMutation = useAddTestimonial();
    const updateMutation = useUpdateTestimonial();
    const deleteMutation = useDeleteTestimonial();

    const logActivity = useActivityStore((s) => s.logActivity);
    const { can } = useRbacStore();
    const { theme } = useThemeStore();

    const [modal, setModal] = useState<"add" | "edit" | null>(null);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleSave = async (t: Testimonial) => {
        try {
            if (modal === "add") {
                await addMutation.mutateAsync(t);
                logActivity({ action: "CREATE", entity: "testimonial", entityId: t.id, entityTitle: t.name });
            } else if (editing) {
                await updateMutation.mutateAsync({ id: editing.id, updates: t });
                logActivity({ action: "UPDATE", entity: "testimonial", entityId: editing.id, entityTitle: t.name });
            }
            setModal(null);
            setEditing(null);
        } catch (error) {
            console.error("Mutation failed", error);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const t = testimonials.find((t) => t.id === deleteTarget);
            await deleteMutation.mutateAsync(deleteTarget);
            logActivity({ action: "DELETE", entity: "testimonial", entityId: deleteTarget, entityTitle: t?.name });
            setDeleteTarget(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-white/40 animate-pulse text-sm">Loading testimonials...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                    <h3 className="text-white font-semibold">Failed to load testimonials</h3>
                    <p className="text-white/40 text-sm mt-1">Please check your connection and try again.</p>
                </div>
                <button onClick={() => window.location.reload()} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-colors">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-xl font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Testimonials</h2>
                    <p className={`text-sm mt-0.5 transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-gray-500 font-medium'}`}>{testimonials.length} total testimonials</p>
                </div>
                {can("create") && (
                    <button onClick={() => setModal("add")} className="admin-btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <Plus className="w-4 h-4" /> Add Testimonial
                    </button>
                )}
            </div>
            {!can("create") && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                    <ShieldAlert className="w-4 h-4" /> View-only mode.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                    <div key={t.id} className="admin-card p-6 flex flex-col hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all group">
                        <Quote className="w-8 h-8 text-blue-500/20 dark:text-blue-500/30 mb-4 shrink-0 transition-colors" />
                        <p className={`text-sm leading-relaxed line-clamp-4 italic mb-6 transition-colors ${theme === 'dark' ? 'text-white/70' : 'text-gray-600 font-medium'}`}>&ldquo;{t.quote}&rdquo;</p>
                        <div className="mt-auto flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.name}</p>
                                <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold mt-0.5 truncate">{t.title}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <button onClick={() => { setEditing(t); setModal("edit"); }} className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-white/20 hover:text-blue-400 hover:bg-blue-400/10' : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'}`}>
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setDeleteTarget(t.id)} className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-white/20 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add Testimonial">
                <TestimonialForm
                    initial={{ ...EMPTY_TESTIMONIAL }}
                    onSave={handleSave}
                    onCancel={() => setModal(null)}
                    isSubmitting={addMutation.isPending}
                />
            </Modal>
            <Modal open={modal === "edit" && !!editing} onClose={() => { setModal(null); setEditing(null); }} title="Edit Testimonial">
                {editing && (
                    <TestimonialForm
                        initial={editing}
                        onSave={handleSave}
                        onCancel={() => { setModal(null); setEditing(null); }}
                        isSubmitting={updateMutation.isPending}
                    />
                )}
            </Modal>
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Testimonial">
                <div className="space-y-5">
                    <p className="text-gray-600 dark:text-white/60 text-sm font-medium leading-relaxed">
                        Are you sure you want to delete this testimonial? This action is permanent and cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-red-500/20"
                        >
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete Testimonial
                        </button>
                        <button
                            onClick={() => setDeleteTarget(null)}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
