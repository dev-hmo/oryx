import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser, Permission } from "@/lib/schemas";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DynamicRole {
    name: string;
    permissions: string[];
    label: string;
    description?: string;
}

interface RbacStore {
    currentUser: Omit<AdminUser, "passwordHash"> | null;
    roles: DynamicRole[];

    setCurrentUser: (user: Omit<AdminUser, "passwordHash"> | null) => void;
    setRoles: (roles: DynamicRole[]) => void;
    fetchRoles: () => Promise<void>;
    can: (permission: Permission) => boolean;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useRbacStore = create<RbacStore>()(
    persist(
        (set, get) => ({
            currentUser: null,
            roles: [],

            setCurrentUser: (user) => set({ currentUser: user }),

            setRoles: (roles) => set({ roles }),

            fetchRoles: async () => {
                try {
                    const res = await fetch("/api/roles");
                    if (res.ok) {
                        const roles = await res.json();
                        set({ roles });
                    }
                } catch (err) {
                    console.error("Failed to fetch roles:", err);
                }
            },

            can: (permission: Permission) => {
                const { currentUser, roles } = get();
                if (!currentUser) return false;
                const roleData = roles.find((r) => r.name === currentUser.role);
                if (!roleData) return false;
                return roleData.permissions.includes(permission);
            },
        }),
        {
            name: "oryx-rbac-store",
            partialize: (state) => ({ currentUser: state.currentUser, roles: state.roles }),
        }
    )
);
