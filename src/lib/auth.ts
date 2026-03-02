import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { JwtPayloadSchema, type JwtPayload, type Role } from "./schemas";

// ── Constants ─────────────────────────────────────────────────────────────────
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "ORYX_ADMIN_SECRET_KEY_CHANGE_IN_PRODUCTION_2026"
);
const JWT_ALGORITHM = "HS256";
const JWT_EXPIRY = "8h"; // 8 hour sessions
const COOKIE_NAME = "oryx-admin-session";

// ── JWT ───────────────────────────────────────────────────────────────────────
export async function signJwt(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string> {
    return new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: JWT_ALGORITHM })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRY)
        .setSubject(payload.sub)
        .sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET, {
            algorithms: [JWT_ALGORITHM],
        });
        const parsed = JwtPayloadSchema.safeParse(payload);
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

// ── Password ──────────────────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12); // bcrypt cost factor 12 = military grade
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}

// ── Cookie Helpers ────────────────────────────────────────────────────────────
export function getSessionCookieName() {
    return COOKIE_NAME;
}

export function buildSecureCookieHeader(token: string): string {
    const maxAge = 8 * 60 * 60; // 8 hours in seconds
    return [
        `${COOKIE_NAME}=${token}`,
        `Max-Age=${maxAge}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Strict",
        ...(process.env.NODE_ENV === "production" ? ["Secure"] : []),
    ].join("; ");
}

export function buildExpireCookieHeader(): string {
    return [
        `${COOKIE_NAME}=`,
        "Max-Age=0",
        "Path=/",
        "HttpOnly",
        "SameSite=Strict",
    ].join("; ");
}

// ── Role Helpers ──────────────────────────────────────────────────────────────
export function getRoleBadgeColor(role: Role): string {
    switch (role) {
        case "super_admin":
            return "bg-red-500/15 text-red-400 border-red-500/20";
        case "editor":
            return "bg-blue-500/15 text-blue-400 border-blue-500/20";
        case "viewer":
            return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
    }
}

export function getRoleLabel(role: Role): string {
    switch (role) {
        case "super_admin": return "Super Admin";
        case "editor": return "Editor";
        case "viewer": return "Viewer";
    }
}
