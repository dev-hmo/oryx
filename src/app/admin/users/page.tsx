"use client";

import React, { useState } from "react";
import { useRbacStore } from "@/store/rbac-store";
import { useActivityStore } from "@/store/activity-store";
import { useThemeStore } from "@/store/theme-store";
import { getRoleBadgeColor, getRoleLabel } from "@/lib/auth";
import { CreateUserSchema, ROLES, type Role, type CreateUserInput, type UpdateUserInput } from "@/lib/schemas";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/use-users";
import {
    Users, Plus, Pencil, Trash2, X, Save, ShieldCheck, ShieldAlert, ShieldOff,
    ToggleLeft, ToggleRight, AlertCircle, Loader2, UserX, Crown, RotateCcw
} from "lucide-react";

// ── Shared UI Components ──────────────────────────────────────────────────────

function Modal({ open, onClose, title, children }: {
    open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0f1628] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto transition-colors">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] sticky top-0 bg-white dark:bg-[#0f1628] z-10 transition-colors">
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

const inputCls = "admin-input";
const labelCls = "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-1.5";

function RoleIcon({ role }: { role: Role }) {
    if (role === "super_admin") return <Crown className="w-3.5 h-3.5" />;
    if (role === "editor") return <ShieldCheck className="w-3.5 h-3.5" />;
    return <ShieldOff className="w-3.5 h-3.5" />;
}

function UserForm({ initial, onSave, onCancel, isEdit, isSubmitting }: {
    initial: Partial<CreateUserInput>;
    onSave: (data: CreateUserInput) => void;
    onCancel: () => void;
    isEdit: boolean;
    isSubmitting: boolean;
}) {
    const [form, setForm] = useState<Partial<CreateUserInput>>({
        username: initial.username ?? "",
        password: "",
        displayName: initial.displayName ?? "",
        role: initial.role ?? "editor",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSave = () => {
        // Skip password validation when editing and field is empty
        const schemaToUse = isEdit
            ? CreateUserSchema.partial({ password: true })
            : CreateUserSchema;

        const result = schemaToUse.safeParse(form);
        if (!result.success) {
            const errs: Record<string, string> = {};
            for (const issue of result.error.issues) {
                const key = String(issue.path[0] ?? "");
                if (key) errs[key] = issue.message;
            }
            setErrors(errs);
            return;
        }
        onSave(result.data as CreateUserInput);
    };

    const set = (k: keyof CreateUserInput, v: string) => {
        setForm((p) => ({ ...p, [k]: v }));
        setErrors((p) => ({ ...p, [k]: "" }));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Username *</label>
                    <input
                        className={`${inputCls} ${errors.username ? "border-red-500" : ""} disabled:opacity-50`}
                        value={form.username}
                        onChange={(e) => set("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        placeholder="e.g. john_doe"
                        disabled={isEdit || isSubmitting}
                    />
                    {errors.username && <p className="text-[11px] text-red-500 mt-1">{errors.username}</p>}
                </div>
                <div>
                    <label className={labelCls}>Display Name *</label>
                    <input
                        className={`${inputCls} ${errors.displayName ? "border-red-500" : ""} disabled:opacity-50`}
                        value={form.displayName}
                        onChange={(e) => set("displayName", e.target.value)}
                        placeholder="John Doe"
                        disabled={isSubmitting}
                    />
                    {errors.displayName && <p className="text-[11px] text-red-400 mt-1">{errors.displayName}</p>}
                </div>
            </div>

            <div>
                <label className={labelCls}>
                    Password {isEdit ? "(leave blank to keep current)" : "*"}
                </label>
                <input
                    type="password"
                    className={`${inputCls} ${errors.password ? "border-red-500/50" : ""} disabled:opacity-50`}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder={isEdit ? "Leave blank to keep current" : "Min 8 chars, upper+lower+number"}
                    disabled={isSubmitting}
                />
                {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div>
                <label className={labelCls}>Role *</label>
                <select
                    className={`${inputCls} disabled:opacity-50`}
                    value={form.role}
                    onChange={(e) => set("role", e.target.value as Role)}
                    disabled={isSubmitting}
                >
                    {ROLES.map((r) => (
                        <option key={r} value={r}>{getRoleLabel(r)}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="admin-btn-primary flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isEdit ? "Save Changes" : "Create User"}
                </button>
                <button onClick={onCancel} className="admin-btn-secondary">
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function UsersPage() {
    const { currentUser, can } = useRbacStore();
    const logActivity = useActivityStore((s) => s.logActivity);
    const { theme } = useThemeStore();

    // Queries & Mutations
    const { data: users, isLoading, error: fetchError, refetch } = useUsers();
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();

    // UI State
    const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
    const [editTarget, setEditTarget] = useState<any | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [toast, setToast] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const canManage = can("manage_users");

    const handleCreate = async (data: CreateUserInput) => {
        try {
            await createUser.mutateAsync(data);
            logActivity({ action: "CREATE", entity: "user", entityId: "new", entityTitle: data.username });
            showToast(`User "${data.username}" created.`);
            setModal(null);
        } catch (err: any) {
            showToast(err.message || "Failed to create user");
        }
    };

    const handleUpdate = async (data: Partial<UpdateUserInput>) => {
        if (!editTarget) return;
        try {
            await updateUser.mutateAsync({ id: editTarget._id || editTarget.id, data });
            logActivity({ action: "UPDATE", entity: "user", entityId: editTarget._id || editTarget.id, entityTitle: editTarget.username });
            showToast(`User "${editTarget.username}" updated.`);
            setModal(null);
            setEditTarget(null);
        } catch (err: any) {
            showToast(err.message || "Failed to update user");
        }
    };

    const handleDelete = async (id: string) => {
        const user = users?.find((u: any) => (u._id || u.id) === id);
        try {
            await deleteUser.mutateAsync(id);
            logActivity({ action: "DELETE", entity: "user", entityId: id, entityTitle: user?.username });
            showToast(`User deleted.`);
            setDeleteTarget(null);
            setModal(null);
        } catch (err: any) {
            showToast(err.message || "Failed to delete user");
        }
    };

    const handleToggleActive = async (user: any) => {
        const id = user._id || user.id;
        try {
            await updateUser.mutateAsync({ id, data: { isActive: !user.isActive } });
            logActivity({
                action: "UPDATE", entity: "user", entityId: id,
                entityTitle: user.username,
                details: user.isActive ? "Deactivated" : "Activated",
            });
            showToast(`User ${user.isActive ? "deactivated" : "activated"}.`);
        } catch (err: any) {
            showToast(err.message || "Action failed");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm text-white/40">Loading users...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-sm text-red-400">{(fetchError as Error).message || "Failed to load users"}</p>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs transition-all"
                >
                    <RotateCcw className="w-3.5 h-3.5" /> Try Again
                </button>
            </div>
        );
    }

    const roleOrder = { super_admin: 0, editor: 1, viewer: 2 };
    const sorted = [...(users || [])].sort((a: any, b: any) => roleOrder[a.role as Role] - roleOrder[b.role as Role]);

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#0f1628] border border-white/10 text-white text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center transition-colors">
                        <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">User Management</h2>
                        <p className="text-sm text-gray-500 dark:text-white/40 transition-colors">{users?.length || 0} admin accounts</p>
                    </div>
                </div>
                {canManage && (
                    <button
                        onClick={() => setModal("add")}
                        className="admin-btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" /> Add User
                    </button>
                )}
            </div>

            {/* Permission banner */}
            {!canManage && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    You have <strong>viewer</strong> access. Only Super Admins can manage users.
                </div>
            )}

            {/* Users table */}
            <div className="admin-card !p-0 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/[0.06] transition-colors">
                            <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider">User</th>
                            <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider">Role</th>
                            <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider hidden md:table-cell">Joined</th>
                            <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                            <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider">Status</th>
                            <th className="w-28 px-4 py-3.5" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04] transition-colors">
                        {sorted.map((user: any) => {
                            const id = user._id || user.id;
                            const isMe = id === currentUser?.id;
                            return (
                                <tr key={id} className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${!user.isActive ? "opacity-50" : ""}`}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-500/30 dark:to-indigo-500/30 border border-blue-100 dark:border-white/10 flex items-center justify-center transition-colors">
                                                <span className={`text-xs font-bold uppercase transition-colors ${theme === 'dark' ? 'text-white/70' : 'text-blue-600'}`}>
                                                    {user.displayName[0]}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-semibold transition-colors ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>{user.displayName}</p>
                                                    {isMe && (
                                                        <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold">YOU</span>
                                                    )}
                                                </div>
                                                <p className={`text-xs transition-colors font-mono ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>@{user.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <RoleIcon role={user.role} />
                                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-500 dark:text-white/40 text-xs hidden md:table-cell transition-colors">
                                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </td>
                                    <td className="px-4 py-4 text-gray-500 dark:text-white/40 text-xs hidden lg:table-cell transition-colors">
                                        {user.lastLoginAt
                                            ? new Date(user.lastLoginAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                            : "Never"}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${user.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            {canManage && !isMe && (
                                                <>
                                                    <button
                                                        onClick={() => handleToggleActive(user)}
                                                        title={user.isActive ? "Deactivate" : "Activate"}
                                                        className="p-1.5 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                                                    >
                                                        {user.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditTarget(user); setModal("edit"); }}
                                                        className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setDeleteTarget(id); setModal("delete"); }}
                                                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add New Admin User">
                <UserForm
                    initial={{}}
                    onSave={handleCreate}
                    onCancel={() => setModal(null)}
                    isEdit={false}
                    isSubmitting={createUser.isPending}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal open={modal === "edit" && !!editTarget} onClose={() => { setModal(null); setEditTarget(null); }} title="Edit User">
                {editTarget && (
                    <UserForm
                        initial={{ username: editTarget.username, displayName: editTarget.displayName, role: editTarget.role }}
                        onSave={handleUpdate}
                        onCancel={() => { setModal(null); setEditTarget(null); }}
                        isEdit={true}
                        isSubmitting={updateUser.isPending}
                    />
                )}
            </Modal>

            {/* Delete Confirm */}
            <Modal open={modal === "delete"} onClose={() => { setModal(null); setDeleteTarget(null); }} title="Delete User">
                <div className="space-y-5">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                            <UserX className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-900 dark:text-white font-bold transition-colors">Confirm Deletion</p>
                            <p className="text-xs text-gray-500 dark:text-white/40 mt-1 leading-relaxed transition-colors">
                                Are you sure you want to delete this user? They will lose all access immediately. This action is permanent and cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => deleteTarget && handleDelete(deleteTarget)}
                            disabled={deleteUser.isPending}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-red-500/20"
                        >
                            {deleteUser.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete User
                        </button>
                        <button
                            onClick={() => { setModal(null); setDeleteTarget(null); }}
                            className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Roles & Permissions Section */}
            <div className={`space-y-4 pt-10 border-t transition-colors ${theme === 'dark' ? 'border-white/[0.06]' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center transition-colors">
                        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Role-Based Permissions</h3>
                        <p className={`text-[11px] transition-colors ${theme === 'dark' ? 'text-white/30' : 'text-gray-500 font-medium'}`}>Define what each role can do across the system</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {useRbacStore.getState().roles.map((r) => (
                        <div key={r.name} className="admin-card group !p-5 overflow-hidden transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getRoleBadgeColor(r.name as Role)}`}>
                                    {r.label || r.name}
                                </span>
                                {canManage && (
                                    <button
                                        onClick={() => { setEditTarget(r); setModal("edit_role" as any); }}
                                        className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${theme === 'dark' ? 'text-white/20 hover:text-blue-400 hover:bg-blue-400/10' : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'}`}
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <p className={`text-[11px] mb-4 line-clamp-2 leading-relaxed transition-colors ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
                                {r.description || "No description provided."}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {r.permissions.map((p) => (
                                    <span key={p} className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-colors ${theme === 'dark' ? 'bg-white/[0.05] text-white/60 border-white/[0.05]' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Role Modal */}
            <Modal
                open={modal === ("edit_role" as any) && !!editTarget}
                onClose={() => { setModal(null); setEditTarget(null); }}
                title={`Manage Permissions: ${editTarget?.label || editTarget?.name}`}
            >
                {editTarget && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">System Permissions</label>
                            <div className="grid grid-cols-2 gap-3">
                                {["read", "create", "update", "delete", "manage_users"].map((p) => (
                                    <label key={p} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-white/20 bg-transparent text-blue-600 focus:ring-offset-0 focus:ring-0"
                                            checked={editTarget.permissions.includes(p)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                const newPerms = checked
                                                    ? [...editTarget.permissions, p]
                                                    : editTarget.permissions.filter((x: string) => x !== p);
                                                setEditTarget({ ...editTarget, permissions: newPerms });
                                            }}
                                        />
                                        <span className="text-sm text-white/80 capitalize">{p.replace("_", " ")}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch("/api/roles", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(editTarget),
                                        });
                                        if (!res.ok) throw new Error("Failed to update role");
                                        await useRbacStore.getState().fetchRoles();
                                        showToast(`Permissions for ${editTarget.label || editTarget.name} updated.`);
                                        setModal(null);
                                        setEditTarget(null);
                                    } catch (err: any) {
                                        showToast(err.message);
                                    }
                                }}
                                className="admin-btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Permissions
                            </button>
                            <button onClick={() => { setModal(null); setEditTarget(null); }} className="admin-btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
