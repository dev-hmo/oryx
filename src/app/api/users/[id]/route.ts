import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { UpdateUserSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";

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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isSuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const parsed = UpdateUserSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid input" },
                { status: 422 }
            );
        }

        await dbConnect();

        const updates: any = { ...parsed.data };
        if (updates.password) {
            const salt = await bcrypt.genSalt(12);
            updates.passwordHash = await bcrypt.hash(updates.password, salt);
            delete updates.password;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-passwordHash");

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (err) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isSuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { id } = await params;
        await dbConnect();

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
