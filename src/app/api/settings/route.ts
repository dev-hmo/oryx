import { NextResponse } from "next/server";
import { contactInfo } from "@/lib/api";
import { SettingsSchema } from "@/lib/schemas";

export async function GET() {
    return NextResponse.json(contactInfo);
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const validated = SettingsSchema.parse(body);

        // In a real app, we would update the database here.
        // For now, we'll just acknowledge the update.
        console.log("Saving settings:", validated);

        return NextResponse.json({ success: true, data: validated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
    }
}
