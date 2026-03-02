"use client";

import React, { useState } from "react";
import { useTestimonials, useAddTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/use-content";
import { useActivityStore } from "@/store/activity-store";
import { useRbacStore } from "@/store/rbac-store";
import { type Testimonial } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Save, Quote, ShieldAlert, Loader2, AlertCircle } from "lucide-react";

const EMPTY_TESTIMONIAL: Testimonial = { id: "", quote: "", name: "", title: "" };

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-500/60 transition-all";

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-[#0f1628] border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0f1628] z-10">
                    <h2 className="text-sm font-semibold text-white">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-medium text-white/40 mb-1.5">{label}</label>
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                </button>
                <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors" disabled={isSubmitting}>Cancel</button>
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
                    <h2 className="text-xl font-bold text-white">Testimonials</h2>
                    <p className="text-sm text-white/40 mt-0.5">{testimonials.length} total testimonials</p>
                </div>
                {can("create") && (
                    <button onClick={() => setModal("add")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20">
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
                    <div key={t.id} className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 group">
                        <Quote className="w-6 h-6 text-blue-500/30 mb-3" />
                        <p className="text-sm text-white/70 leading-relaxed line-clamp-4 italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-white">{t.name}</p>
                                <p className="text-xs text-blue-400 mt-0.5">{t.title}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setEditing(t); setModal("edit"); }} className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setDeleteTarget(t.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors">
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
                    <p className="text-white/60 text-sm">Delete this testimonial?</p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete
                        </button>
                        <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors" disabled={deleteMutation.isPending}>Cancel</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
