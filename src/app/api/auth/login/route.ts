import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/schemas";
import { signJwt, verifyPassword, buildSecureCookieHeader, getRoleLabel } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

// ── Rate limiting (in-memory, per-IP) ─────────────────────────────────────────
const loginAttempts = new Map<string, { count: number; firstAttempt: number; locked: boolean }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minute lockout

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter?: number } {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record) {
        loginAttempts.set(ip, { count: 0, firstAttempt: now, locked: false });
        return { allowed: true, remaining: MAX_ATTEMPTS };
    }

    // Reset window if expired
    if (!record.locked && now - record.firstAttempt > WINDOW_MS) {
        loginAttempts.set(ip, { count: 0, firstAttempt: now, locked: false });
        return { allowed: true, remaining: MAX_ATTEMPTS };
    }

    if (record.locked) {
        const elapsed = now - record.firstAttempt;
        if (elapsed < LOCKOUT_MS) {
            return {
                allowed: false,
                remaining: 0,
                retryAfter: Math.ceil((LOCKOUT_MS - elapsed) / 1000 / 60),
            };
        }
        // Lockout expired — reset
        loginAttempts.set(ip, { count: 0, firstAttempt: now, locked: false });
        return { allowed: true, remaining: MAX_ATTEMPTS };
    }

    return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

function recordFailedAttempt(ip: string) {
    const record = loginAttempts.get(ip) ?? { count: 0, firstAttempt: Date.now(), locked: false };
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
        record.locked = true;
        record.firstAttempt = Date.now(); // reset timer for lockout
    }
    loginAttempts.set(ip, record);
}

function clearAttempts(ip: string) {
    loginAttempts.delete(ip);
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        request.headers.get("x-real-ip") ??
        "unknown";

    // Rate limit check
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: `Too many login attempts. Try again in ${rateLimit.retryAfter} minutes.` },
            {
                status: 429,
                headers: {
                    "Retry-After": String((rateLimit.retryAfter ?? 30) * 60),
                    "X-RateLimit-Limit": String(MAX_ATTEMPTS),
                    "X-RateLimit-Remaining": "0",
                },
            }
        );
    }

    // Parse body
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Zod validation
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid input" },
            { status: 422 }
        );
    }

    const { username, password } = parsed.data;

    try {
        await dbConnect();

        // Find user in database
        let user = await User.findOne({
            username: username.toLowerCase(),
            isActive: true
        });

        // Rescue Seed: If NO users exist at all, create a default admin
        if (!user) {
            const userCount = await User.countDocuments();
            if (userCount === 0) {
                console.log("No users found in database. Seeding default admin...");
                const salt = await bcrypt.genSalt(12);
                const passwordHash = await bcrypt.hash("21121975", salt);

                user = await User.create({
                    username: "admin",
                    passwordHash,
                    displayName: "Super Admin",
                    role: "super_admin",
                    isActive: true
                });

                // If the user was trying to log in as 'admin', we can now proceed
                if (username.toLowerCase() !== "admin") {
                    user = null; // Reset if they weren't trying to log in as the new admin
                }
            }
        }

        if (!user) {
            recordFailedAttempt(ip);
            // Constant-time-ish response to prevent user enumeration
            await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
            return NextResponse.json(
                { error: "Invalid username or password." },
                { status: 401 }
            );
        }

        // Verify password using bcrypt (via helper in lib/auth)
        const passwordOk = await verifyPassword(password, user.passwordHash);

        if (!passwordOk) {
            recordFailedAttempt(ip);
            await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
            return NextResponse.json(
                { error: "Invalid username or password." },
                { status: 401 }
            );
        }

        // Success — update lastLoginAt, clear rate limit, sign JWT
        user.lastLoginAt = new Date();
        await user.save();

        clearAttempts(ip);

        const token = await signJwt({
            sub: user._id.toString(),
            username: user.username,
            displayName: user.displayName,
            role: user.role,
        });

        const response = NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                username: user.username,
                displayName: user.displayName,
                role: user.role,
                roleLabel: getRoleLabel(user.role),
            },
        });

        // Set secure HttpOnly cookie
        response.headers.set("Set-Cookie", buildSecureCookieHeader(token));

        return response;

    } catch (err) {
        console.error("Login API Error:", err);
        return NextResponse.json(
            { error: "An internal server error occurred. Please try again later." },
            { status: 500 }
        );
    }
}
