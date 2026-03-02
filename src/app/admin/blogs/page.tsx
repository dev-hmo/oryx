"use client";

import React, { useState } from "react";
import { useBlogs, useAddBlog, useUpdateBlog, useDeleteBlog } from "@/hooks/use-content";
import { useActivityStore } from "@/store/activity-store";
import { useRbacStore } from "@/store/rbac-store";
import ImageUpload from "@/components/ImageUpload";
import { type BlogPost } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Save, Calendar, Clock, ShieldAlert, Loader2, AlertCircle } from "lucide-react";

const CATEGORIES = ["News", "Event", "Success Story", "Guide"] as const;

const EMPTY_POST: BlogPost = {
    id: "",
    title: "",
    category: "News",
    date: "",
    excerpt: "",
    image: "",
    readTime: "",
};

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

function BlogForm({
    initial,
    onSave,
    onCancel,
    isSubmitting = false,
}: {
    initial: BlogPost;
    onSave: (p: BlogPost) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}) {
    const [form, setForm] = useState(initial);
    const set = (k: keyof BlogPost, v: string) => setForm((p) => ({ ...p, [k]: v }));
    const handleSave = () => {
        if (!form.title || !form.id) return;
        onSave(form);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Field label="ID *"><input className={inputCls} value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="blog-4" disabled={isSubmitting} /></Field>
                <Field label="Category">
                    <select className={inputCls} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as BlogPost["category"] }))} disabled={isSubmitting}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </Field>
            </div>
            <Field label="Title *"><input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Blog post title" disabled={isSubmitting} /></Field>
            <Field label="Excerpt">
                <textarea className={`${inputCls} resize-none h-20`} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short summary..." disabled={isSubmitting} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Date"><input className={inputCls} value={form.date} onChange={(e) => set("date", e.target.value)} placeholder="Feb 15, 2026" disabled={isSubmitting} /></Field>
                <Field label="Read Time"><input className={inputCls} value={form.readTime} onChange={(e) => set("readTime", e.target.value)} placeholder="3 min read" disabled={isSubmitting} /></Field>
            </div>
            <ImageUpload
                label="Cover Image"
                value={form.image}
                onChange={(url) => set("image", url)}
            />
            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Post
                </button>
                <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors" disabled={isSubmitting}>Cancel</button>
            </div>
        </div>
    );
}

const categoryColor: Record<string, string> = {
    "News": "bg-blue-500/15 text-blue-400",
    "Event": "bg-amber-500/15 text-amber-400",
    "Success Story": "bg-emerald-500/15 text-emerald-400",
    "Guide": "bg-purple-500/15 text-purple-400",
};

export default function BlogsAdmin() {
    const { data: blogs = [], isLoading, isError } = useBlogs();
    const addMutation = useAddBlog();
    const updateMutation = useUpdateBlog();
    const deleteMutation = useDeleteBlog();

    const logActivity = useActivityStore((s) => s.logActivity);
    const { can } = useRbacStore();

    const [modal, setModal] = useState<"add" | "edit" | null>(null);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleSave = async (post: BlogPost) => {
        try {
            if (modal === "add") {
                await addMutation.mutateAsync(post);
                logActivity({ action: "CREATE", entity: "blog", entityId: post.id, entityTitle: post.title });
            } else if (editing) {
                await updateMutation.mutateAsync({ id: editing.id, updates: post });
                logActivity({ action: "UPDATE", entity: "blog", entityId: editing.id, entityTitle: post.title });
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
            const post = blogs.find((b) => b.id === deleteTarget);
            await deleteMutation.mutateAsync(deleteTarget);
            logActivity({ action: "DELETE", entity: "blog", entityId: deleteTarget, entityTitle: post?.title });
            setDeleteTarget(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-white/40 animate-pulse text-sm">Loading blog posts...</p>
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
                    <h3 className="text-white font-semibold">Failed to load blogs</h3>
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
                    <h2 className="text-xl font-bold text-white">Blog Posts</h2>
                    <p className="text-sm text-white/40 mt-0.5">{blogs.length} total posts</p>
                </div>
                {can("create") && (
                    <button onClick={() => setModal("add")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20">
                        <Plus className="w-4 h-4" /> Add Post
                    </button>
                )}
            </div>
            {!can("create") && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                    <ShieldAlert className="w-4 h-4" /> View-only mode.
                </div>
            )}

            <div className="space-y-3">
                {blogs.map((post) => (
                    <div key={post.id} className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors group">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-white/[0.05] shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${categoryColor[post.category] ?? "bg-white/10 text-white/40"}`}>
                                    {post.category}
                                </span>
                            </div>
                            <p className="font-medium text-white/90 text-sm truncate">{post.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => { setEditing(post); setModal("edit"); }} className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteTarget(post.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add Blog Post">
                <BlogForm
                    initial={{ ...EMPTY_POST }}
                    onSave={handleSave}
                    onCancel={() => setModal(null)}
                    isSubmitting={addMutation.isPending}
                />
            </Modal>
            <Modal open={modal === "edit" && !!editing} onClose={() => { setModal(null); setEditing(null); }} title="Edit Blog Post">
                {editing && (
                    <BlogForm
                        initial={editing}
                        onSave={handleSave}
                        onCancel={() => { setModal(null); setEditing(null); }}
                        isSubmitting={updateMutation.isPending}
                    />
                )}
            </Modal>
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Post">
                <div className="space-y-5">
                    <p className="text-white/60 text-sm">Delete this blog post permanently?</p>
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
