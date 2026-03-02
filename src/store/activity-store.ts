import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ActivityLog, ActivityFilter, ActionType, EntityType, Role } from "@/lib/schemas";

// ── Types ─────────────────────────────────────────────────────────────────────
interface CurrentUser {
    id: string;
    username: string;
    displayName: string;
    role: Role;
}

interface ActivityStore {
    logs: ActivityLog[];
    currentUser: CurrentUser | null;

    setCurrentUser: (user: CurrentUser | null) => void;
    logActivity: (params: {
        action: ActionType;
        entity: EntityType;
        entityId?: string;
        entityTitle?: string;
        details?: string;
        success?: boolean;
    }) => void;

    getFilteredLogs: (filter: ActivityFilter) => ActivityLog[];
    clearLogs: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function matchesFilter(log: ActivityLog, filter: ActivityFilter): boolean {
    if (filter.username && !log.username.toLowerCase().includes(filter.username.toLowerCase()))
        return false;
    if (filter.role && log.role !== filter.role) return false;
    if (filter.action && log.action !== filter.action) return false;
    if (filter.entity && log.entity !== filter.entity) return false;
    if (filter.dateFrom && log.timestamp < filter.dateFrom) return false;
    if (filter.dateTo && log.timestamp > filter.dateTo + "T23:59:59Z") return false;
    if (filter.search) {
        const q = filter.search.toLowerCase();
        const hay = [log.username, log.displayName, log.entityTitle ?? "", log.details ?? ""]
            .join(" ")
            .toLowerCase();
        if (!hay.includes(q)) return false;
    }
    return true;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useActivityStore = create<ActivityStore>()(
    persist(
        (set, get) => ({
            logs: [],
            currentUser: null,

            setCurrentUser: (user) => set({ currentUser: user }),

            logActivity: ({ action, entity, entityId, entityTitle, details, success = true }) => {
                const user = get().currentUser;
                if (!user) return;

                const log: ActivityLog = {
                    id: generateId(),
                    userId: user.id,
                    username: user.username,
                    displayName: user.displayName,
                    role: user.role,
                    action,
                    entity,
                    entityId,
                    entityTitle,
                    details,
                    timestamp: new Date().toISOString(),
                    success,
                };

                set((state) => ({
                    // Keep max 1000 logs, newest first
                    logs: [log, ...state.logs].slice(0, 1000),
                }));
            },

            getFilteredLogs: (filter) => {
                const { logs } = get();
                return logs.filter((log) => matchesFilter(log, filter));
            },

            clearLogs: () => set({ logs: [] }),
        }),
        {
            name: "oryx-activity-logs",
            partialize: (state) => ({ logs: state.logs }),
        }
    )
);
