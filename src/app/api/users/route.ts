import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { CreateUserSchema, UpdateUserSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";

// Helper to check for Super Admin role
async function isSuperAdmin(request: Request) {
    const cookie = request.headers.get("cookie");
    const token = cookie
        ?.split("; ")
        .find((row) => row.startsWith("oryx-admin-session="))
        ?.split("=")[1];

    if (!token) return false;
    const payload = await verifyJwt(token);
    return payload?.role === "super_admin";
}

export async function GET(request: Request) {
    if (!(await isSuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        await dbConnect();
        const users = await User.find({}).select("-passwordHash").sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await isSuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const parsed = CreateUserSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid input" },
                { status: 422 }
            );
        }

        await dbConnect();

        // Check for existing user
        const existing = await User.findOne({ username: parsed.data.username.toLowerCase() });
        if (existing) {
            return NextResponse.json({ error: "Username already exists" }, { status: 409 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(parsed.data.password, salt);

        const newUser = await User.create({
            username: parsed.data.username.toLowerCase(),
            passwordHash,
            displayName: parsed.data.displayName,
            role: parsed.data.role,
            isActive: true,
        });

        const userResponse = newUser.toObject();
        delete (userResponse as any).passwordHash;

        return NextResponse.json(userResponse, { status: 201 });
    } catch (err) {
        console.error("User Create Error:", err);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
