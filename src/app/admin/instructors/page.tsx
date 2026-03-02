"use client";

import React, { useState } from "react";
import { useInstructors, useAddInstructor, useUpdateInstructor, useDeleteInstructor } from "@/hooks/use-content";
import { useActivityStore } from "@/store/activity-store";
import { useRbacStore } from "@/store/rbac-store";
import ImageUpload from "@/components/ImageUpload";
import { type Instructor } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Save, ShieldAlert, Loader2, AlertCircle } from "lucide-react";

const EMPTY_INSTRUCTOR: Instructor = {
    id: "",
    name: "",
    role: "",
    experience: "",
    bio: "",
    image: "",
    expertise: [],
};

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-500/60 transition-all";

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#0f1628] border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
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

function InstructorForm({
    initial,
    onSave,
    onCancel,
    isSubmitting = false,
}: {
    initial: Instructor;
    onSave: (i: Instructor) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}) {
    const [form, setForm] = useState(initial);
    const [expertiseText, setExpertiseText] = useState(initial.expertise.join(", "));

    const set = (k: keyof Instructor, v: string) => setForm((p) => ({ ...p, [k]: v }));
    const handleSave = () => {
        if (!form.name || !form.id) return;
        onSave({ ...form, expertise: expertiseText.split(",").map((s) => s.trim()).filter(Boolean) });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Field label="ID *"><input className={inputCls} value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="inst-1" disabled={isSubmitting} /></Field>
                <Field label="Experience"><input className={inputCls} value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="15+ Years" disabled={isSubmitting} /></Field>
            </div>
            <Field label="Full Name *"><input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Chef Marcus Lin" disabled={isSubmitting} /></Field>
            <Field label="Role"><input className={inputCls} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Executive Culinary Director" disabled={isSubmitting} /></Field>
            <Field label="Bio">
                <textarea className={`${inputCls} resize-none h-24`} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Professional bio..." disabled={isSubmitting} />
            </Field>
            <ImageUpload
                label="Instructor Photo"
                value={form.image}
                onChange={(url) => set("image", url)}
            />
            <Field label="Expertise (comma-separated)"><input className={inputCls} value={expertiseText} onChange={(e) => setExpertiseText(e.target.value)} placeholder="Menu Planning, Western Cuisine, Galley Operations" disabled={isSubmitting} /></Field>
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

export default function InstructorsAdmin() {
    const { data: instructors = [], isLoading, isError } = useInstructors();
    const addMutation = useAddInstructor();
    const updateMutation = useUpdateInstructor();
    const deleteMutation = useDeleteInstructor();

    const logActivity = useActivityStore((s) => s.logActivity);
    const { can } = useRbacStore();

    const [modal, setModal] = useState<"add" | "edit" | null>(null);
    const [editing, setEditing] = useState<Instructor | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleSave = async (instructor: Instructor) => {
        try {
            if (modal === "add") {
                await addMutation.mutateAsync(instructor);
                logActivity({ action: "CREATE", entity: "instructor", entityId: instructor.id, entityTitle: instructor.name });
            } else if (editing) {
                await updateMutation.mutateAsync({ id: editing.id, updates: instructor });
                logActivity({ action: "UPDATE", entity: "instructor", entityId: editing.id, entityTitle: instructor.name });
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
            const inst = instructors.find((i) => i.id === deleteTarget);
            await deleteMutation.mutateAsync(deleteTarget);
            logActivity({ action: "DELETE", entity: "instructor", entityId: deleteTarget, entityTitle: inst?.name });
            setDeleteTarget(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-white/40 animate-pulse text-sm">Loading instructors...</p>
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
                    <h3 className="text-white font-semibold">Failed to load instructors</h3>
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
                    <h2 className="text-xl font-bold text-white">Instructors</h2>
                    <p className="text-sm text-white/40 mt-0.5">{instructors.length} total instructors</p>
                </div>
                {can("create") && (
                    <button onClick={() => setModal("add")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20">
                        <Plus className="w-4 h-4" /> Add Instructor
                    </button>
                )}
            </div>
            {!can("create") && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                    <ShieldAlert className="w-4 h-4" /> View-only mode.
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {instructors.map((inst) => (
                    <div key={inst.id} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden group">
                        <div className="aspect-[3/2] relative bg-white/[0.05]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <p className="font-semibold text-white text-sm">{inst.name}</p>
                                    <p className="text-xs text-blue-400 mt-0.5">{inst.role}</p>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-white/[0.06] text-white/40">{inst.experience}</span>
                            </div>
                            <p className="text-xs text-white/40 mt-2 line-clamp-2">{inst.bio}</p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {inst.expertise.map((e) => (
                                    <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40">{e}</span>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button onClick={() => { setEditing(inst); setModal("edit"); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition-colors">
                                    <Pencil className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => setDeleteTarget(inst.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors">
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add Instructor">
                <InstructorForm
                    initial={{ ...EMPTY_INSTRUCTOR }}
                    onSave={handleSave}
                    onCancel={() => setModal(null)}
                    isSubmitting={addMutation.isPending}
                />
            </Modal>
            <Modal open={modal === "edit" && !!editing} onClose={() => { setModal(null); setEditing(null); }} title="Edit Instructor">
                {editing && (
                    <InstructorForm
                        initial={editing}
                        onSave={handleSave}
                        onCancel={() => { setModal(null); setEditing(null); }}
                        isSubmitting={updateMutation.isPending}
                    />
                )}
            </Modal>
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Instructor">
                <div className="space-y-5">
                    <p className="text-white/60 text-sm">Delete this instructor permanently?</p>
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
