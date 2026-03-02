import { NextResponse } from "next/server";
import { instructorsData } from "@/lib/api";
import { InstructorSchema } from "@/lib/schemas";

let instructors = [...instructorsData];

export async function GET() {
    return NextResponse.json(instructors);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = InstructorSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
        }

        const newInstructor = { ...parsed.data };
        instructors = [...instructors, newInstructor as any];

        return NextResponse.json(newInstructor, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create instructor" }, { status: 500 });
    }
}
