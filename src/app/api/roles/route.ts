import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Role from "@/lib/models/Role";

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

export async function GET() {
    try {
        await dbConnect();
        let roles = await Role.find({});

        // Rescue Seed: If no roles exist, create default ones
        if (roles.length === 0) {
            console.log("No roles found. Seeding defaults...");
            const defaults = [
                { name: "super_admin", label: "Super Admin", permissions: ["read", "create", "update", "delete", "manage_users"], description: "Full access" },
                { name: "editor", label: "Content Editor", permissions: ["read", "create", "update"], description: "Manage content" },
                { name: "viewer", label: "Read-Only Viewer", permissions: ["read"], description: "View only" },
            ];

            try {
                // Bulk insert with ordered: false to continue on duplicates, 
                // though find-then-insert is usually enough, race conditions happen.
                await Role.insertMany(defaults, { ordered: false });
            } catch (bulkErr: any) {
                // If it's just duplicate keys (code 11000), we can ignore it as someone else seeded.
                if (bulkErr.code !== 11000) throw bulkErr;
            }

            roles = await Role.find({});
        }

        return NextResponse.json(roles);
    } catch (err: any) {
        console.error("Failed to fetch roles:", err);
        return NextResponse.json({
            error: "Failed to fetch roles",
            message: err.message,
            name: err.name,
            stack: err.stack
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await isSuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, permissions, label, description } = body;

        if (!name || !permissions) {
            return NextResponse.json({ error: "Name and permissions are required" }, { status: 400 });
        }

        await dbConnect();

        const updatedRole = await Role.findOneAndUpdate(
            { name },
            { permissions, label, description },
            { new: true, upsert: true }
        );

        return NextResponse.json(updatedRole);
    } catch (err) {
        return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }
}
