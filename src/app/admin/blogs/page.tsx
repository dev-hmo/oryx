"use client";

import React, { useState } from "react";
import { useBlogs, useAddBlog, useUpdateBlog, useDeleteBlog } from "@/hooks/use-content";
import { useActivityStore } from "@/store/activity-store";
import { useRbacStore } from "@/store/rbac-store";
import { useThemeStore } from "@/store/theme-store";
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
                    className="admin-btn-primary flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Post
                </button>
                <button onClick={onCancel} className="admin-btn-secondary" disabled={isSubmitting}>Cancel</button>
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
    const { theme } = useThemeStore();

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
                    <h2 className={`text-xl font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Blog Posts</h2>
                    <p className={`text-sm mt-0.5 transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-gray-500 font-medium'}`}>{blogs.length} total posts</p>
                </div>
                {can("create") && (
                    <button onClick={() => setModal("add")} className="admin-btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20">
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
                    <div key={post.id} className="admin-card !p-4 flex items-center gap-4 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all group">
                        <div className={`w-16 h-12 rounded-xl overflow-hidden shrink-0 transition-colors ${theme === 'dark' ? 'bg-white/[0.05]' : 'bg-gray-100'}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors ${categoryColor[post.category] ?? (theme === 'dark' ? 'bg-white/10 text-white/40 border-white/10' : 'bg-gray-100 text-gray-400 border-gray-200')}`}>
                                    {post.category}
                                </span>
                            </div>
                            <p className={`font-bold text-sm truncate transition-colors ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>{post.title}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] font-medium transition-colors text-gray-400 dark:text-white/30">
                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => { setEditing(post); setModal("edit"); }} className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-white/20 hover:text-blue-400 hover:bg-blue-400/10' : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'}`}>
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteTarget(post.id)} className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-white/20 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
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
