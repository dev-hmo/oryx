import { z } from "zod";

// ── Roles ─────────────────────────────────────────────────────────────────────
export const ROLES = ["super_admin", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const RoleSchema = z.enum(ROLES);

// ── Permissions ───────────────────────────────────────────────────────────────
export const PERMISSIONS = {
    super_admin: ["read", "create", "update", "delete", "manage_users"],
    editor: ["read", "create", "update"],
    viewer: ["read"],
} as const satisfies Record<Role, readonly string[]>;

export type Permission = "read" | "create" | "update" | "delete" | "manage_users";

/**
 * @deprecated Use useRbacStore.getState().can(permission) in components 
 * or check the database Roles collection on the server.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    // This is legacy static check. Components should use Zustand store's reactive 'can' method.
    return (PERMISSIONS[role] as readonly string[]).includes(permission);
}

// ── Admin User ─────────────────────────────────────────────────────────────────
export const AdminUserSchema = z.object({
    id: z.string().min(1),
    username: z.string().min(3).max(32).regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
    passwordHash: z.string().min(1),
    role: RoleSchema,
    displayName: z.string().min(1).max(64),
    createdAt: z.string().datetime(),
    lastLoginAt: z.string().datetime().nullable(),
    isActive: z.boolean(),
});
export type AdminUser = z.infer<typeof AdminUserSchema>;

// ── Login ─────────────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
    username: z
        .string()
        .min(1, "Username is required")
        .max(32)
        .regex(/^[a-z0-9_]+$/, "Invalid username format"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(128),
});
export type LoginInput = z.infer<typeof LoginSchema>;

// ── JWT Payload ───────────────────────────────────────────────────────────────
export const JwtPayloadSchema = z.object({
    sub: z.string(),
    username: z.string(),
    displayName: z.string(),
    role: RoleSchema,
    iat: z.number().optional(),
    exp: z.number().optional(),
});
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// ── Activity Log ──────────────────────────────────────────────────────────────
export const ACTION_TYPES = [
    "LOGIN",
    "LOGOUT",
    "CREATE",
    "UPDATE",
    "DELETE",
    "VIEW",
    "EXPORT",
] as const;

export const ENTITY_TYPES = [
    "course",
    "instructor",
    "blog",
    "testimonial",
    "settings",
    "user",
    "system",
] as const;

export type ActionType = (typeof ACTION_TYPES)[number];
export type EntityType = (typeof ENTITY_TYPES)[number];

export const ActivityLogSchema = z.object({
    id: z.string(),
    userId: z.string(),
    username: z.string(),
    displayName: z.string(),
    role: RoleSchema,
    action: z.enum(ACTION_TYPES),
    entity: z.enum(ENTITY_TYPES),
    entityId: z.string().optional(),
    entityTitle: z.string().optional(),
    details: z.string().optional(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    timestamp: z.string().datetime(),
    success: z.boolean(),
});
export type ActivityLog = z.infer<typeof ActivityLogSchema>;

// ── Activity Filters ──────────────────────────────────────────────────────────
export const ActivityFilterSchema = z.object({
    username: z.string().optional(),
    role: RoleSchema.optional(),
    action: z.enum(ACTION_TYPES).optional(),
    entity: z.enum(ENTITY_TYPES).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    search: z.string().optional(),
});
export type ActivityFilter = z.infer<typeof ActivityFilterSchema>;

// ── Course ────────────────────────────────────────────────────────────────────
export const CourseSchema = z.object({
    id: z.string().min(1, "ID is required"),
    title: z.string().min(1, "Title is required").max(100),
    subtitle: z.string().max(120),
    description: z.string().min(10, "Description too short"),
    highlights: z.array(z.string()).min(1, "Add at least one highlight"),
    duration: z.string().min(1),
    fee: z.string().min(1),
    schedule: z.string().min(1),
    time: z.string().min(1),
    startDate: z.string().min(1),
    batch: z.string().min(1),
    icon: z.string().min(1),
    category: z.enum(["hospitality", "culinary", "maritime", "operations"]),
});
export type CourseInput = z.infer<typeof CourseSchema>;

// ── Instructor ────────────────────────────────────────────────────────────────
export const InstructorSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(80),
    role: z.string().min(1).max(80),
    experience: z.string().min(1),
    bio: z.string().min(10),
    image: z.string().url("Must be a valid URL"),
    expertise: z.array(z.string()).min(1),
});

// ── Blog ──────────────────────────────────────────────────────────────────────
export const BlogSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1).max(150),
    category: z.enum(["News", "Event", "Success Story", "Guide"]),
    date: z.string().min(1),
    excerpt: z.string().min(10).max(500),
    image: z.string().url(),
    readTime: z.string().min(1),
});

// ── Testimonial ───────────────────────────────────────────────────────────────
export const TestimonialSchema = z.object({
    id: z.string().min(1),
    quote: z.string().min(10).max(500),
    name: z.string().min(1).max(80),
    title: z.string().min(1).max(100),
});

// ── Settings / Contact Info ───────────────────────────────────────────────────
export const SettingsSchema = z.object({
    phones: z.array(z.string().min(1)).min(1),
    viber: z.string().min(1),
    whatsapp: z.string().min(1),
    addresses: z.array(z.string().min(1)).min(1),
});
export type SettingsInput = z.infer<typeof SettingsSchema>;

// ── Admin User Management ─────────────────────────────────────────────────────
export const CreateUserSchema = z.object({
    username: z
        .string()
        .min(3)
        .max(32)
        .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain uppercase, lowercase, and a number"
        ),
    displayName: z.string().min(1).max(64),
    role: RoleSchema,
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial().extend({
    password: z
        .string()
        .min(8)
        .max(128)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Too weak")
        .optional(),
    isActive: z.boolean().optional(),
});
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
