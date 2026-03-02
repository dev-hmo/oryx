"use client";

import React, { useState } from "react";
import { useCourses, useAddCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/use-content";
import { useActivityStore } from "@/store/activity-store";
import { useRbacStore } from "@/store/rbac-store";
import { type Course } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Save, ShieldAlert, Loader2, AlertCircle } from "lucide-react";

const CATEGORIES = ["hospitality", "culinary", "maritime", "operations"] as const;

const EMPTY_COURSE: Course = {
    id: "",
    title: "",
    subtitle: "",
    description: "",
    highlights: [],
    duration: "",
    fee: "",
    schedule: "",
    time: "",
    startDate: "",
    batch: "",
    icon: "📚",
    category: "hospitality",
};

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
            <div className="relative w-full max-w-2xl bg-[#0f1628] border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0f1628] z-10">
                    <h2 className="text-sm font-semibold text-white">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
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

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-500/60 transition-all";

function CourseForm({
    initial,
    onSave,
    onCancel,
    isSubmitting = false,
}: {
    initial: Course;
    onSave: (c: Course) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}) {
    const [form, setForm] = useState<Course>(initial);
    const [highlightsText, setHighlightsText] = useState(initial.highlights.join("\n"));

    const set = (k: keyof Course, v: string) => setForm((p) => ({ ...p, [k]: v }));

    const handleSave = () => {
        if (!form.title || !form.id) return;
        onSave({
            ...form,
            highlights: highlightsText.split("\n").map((s) => s.trim()).filter(Boolean),
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Field label="Course ID *">
                    <input className={inputCls} value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="e.g. fb-service" disabled={isSubmitting} />
                </Field>
                <Field label="Icon (emoji)">
                    <input className={inputCls} value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="🍽️" disabled={isSubmitting} />
                </Field>
            </div>
            <Field label="Title *">
                <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Course title" disabled={isSubmitting} />
            </Field>
            <Field label="Subtitle">
                <input className={inputCls} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Short subtitle" disabled={isSubmitting} />
            </Field>
            <Field label="Description">
                <textarea className={`${inputCls} resize-none h-24`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Full description..." disabled={isSubmitting} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Duration">
                    <input className={inputCls} value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="6 Weeks" disabled={isSubmitting} />
                </Field>
                <Field label="Fee">
                    <input className={inputCls} value={form.fee} onChange={(e) => set("fee", e.target.value)} placeholder="300,000 MMK" disabled={isSubmitting} />
                </Field>
                <Field label="Schedule">
                    <input className={inputCls} value={form.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="Mon – Fri" disabled={isSubmitting} />
                </Field>
                <Field label="Time">
                    <input className={inputCls} value={form.time} onChange={(e) => set("time", e.target.value)} placeholder="9:00 AM – 12:00 PM" disabled={isSubmitting} />
                </Field>
                <Field label="Start Date">
                    <input className={inputCls} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} placeholder="25 Feb 2026" disabled={isSubmitting} />
                </Field>
                <Field label="Batch">
                    <input className={inputCls} value={form.batch} onChange={(e) => set("batch", e.target.value)} placeholder="Batch 5" disabled={isSubmitting} />
                </Field>
            </div>
            <Field label="Category">
                <select className={inputCls} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Course["category"] }))} disabled={isSubmitting}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </Field>
            <Field label="Highlights (one per line)">
                <textarea className={`${inputCls} resize-none h-32`} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder={"Restaurant & Table Setup\nProfessional Order Taking"} disabled={isSubmitting} />
            </Field>
            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Course
                </button>
                <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors" disabled={isSubmitting}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default function CoursesAdmin() {
    const { data: courses = [], isLoading, isError } = useCourses();
    const addMutation = useAddCourse();
    const updateMutation = useUpdateCourse();
    const deleteMutation = useDeleteCourse();

    const logActivity = useActivityStore((s) => s.logActivity);
    const { can } = useRbacStore();

    const [modal, setModal] = useState<"add" | "edit" | null>(null);
    const [editing, setEditing] = useState<Course | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleSave = async (course: Course) => {
        try {
            if (modal === "add") {
                await addMutation.mutateAsync(course);
                logActivity({ action: "CREATE", entity: "course", entityId: course.id, entityTitle: course.title });
            } else if (modal === "edit" && editing) {
                await updateMutation.mutateAsync({ id: editing.id, updates: course });
                logActivity({ action: "UPDATE", entity: "course", entityId: editing.id, entityTitle: course.title });
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
            const course = courses.find((c) => c.id === deleteTarget);
            await deleteMutation.mutateAsync(deleteTarget);
            logActivity({ action: "DELETE", entity: "course", entityId: deleteTarget, entityTitle: course?.title });
            setDeleteTarget(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-white/40 animate-pulse text-sm">Loading courses...</p>
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
                    <h3 className="text-white font-semibold">Failed to load courses</h3>
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Courses</h2>
                    <p className="text-sm text-white/40 mt-0.5">{courses.length} total courses</p>
                </div>
                {can("create") && (
                    <button
                        onClick={() => setModal("add")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" /> Add Course
                    </button>
                )}
            </div>
            {!can("create") && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                    <ShieldAlert className="w-4 h-4" /> View-only mode. You need Editor or higher to make changes.
                </div>
            )}

            {/* Table */}
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Course</th>
                            <th className="text-left px-4 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Category</th>
                            <th className="text-left px-4 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">Duration</th>
                            <th className="text-left px-4 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">Fee</th>
                            <th className="text-left px-4 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Start Date</th>
                            <th className="w-24 px-4 py-3.5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{course.icon}</span>
                                        <div>
                                            <p className="font-medium text-white/90">{course.title}</p>
                                            <p className="text-xs text-white/30">{course.subtitle}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 hidden md:table-cell">
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold
                                        ${course.category === "hospitality" ? "bg-amber-500/15 text-amber-400" :
                                            course.category === "culinary" ? "bg-emerald-500/15 text-emerald-400" :
                                                course.category === "maritime" ? "bg-cyan-500/15 text-cyan-400" :
                                                    "bg-purple-500/15 text-purple-400"}`}>
                                        {course.category}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-white/50 hidden lg:table-cell">{course.duration}</td>
                                <td className="px-4 py-4 text-white/50 hidden lg:table-cell">{course.fee}</td>
                                <td className="px-4 py-4 text-white/50 hidden md:table-cell">{course.startDate}</td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            onClick={() => { setEditing(course); setModal("edit"); }}
                                            className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(course.id)}
                                            className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add New Course">
                <CourseForm
                    initial={{ ...EMPTY_COURSE }}
                    onSave={handleSave}
                    onCancel={() => setModal(null)}
                    isSubmitting={addMutation.isPending}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal open={modal === "edit" && !!editing} onClose={() => { setModal(null); setEditing(null); }} title="Edit Course">
                {editing && (
                    <CourseForm
                        initial={editing}
                        onSave={handleSave}
                        onCancel={() => { setModal(null); setEditing(null); }}
                        isSubmitting={updateMutation.isPending}
                    />
                )}
            </Modal>

            {/* Delete Confirm */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Course">
                <div className="space-y-5">
                    <p className="text-white/60 text-sm">Are you sure you want to delete this course? This action cannot be undone.</p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete
                        </button>
                        <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors" disabled={deleteMutation.isPending}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
