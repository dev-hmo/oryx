import { NextResponse } from "next/server";
import { coursesData } from "@/lib/api";
import { CourseSchema } from "@/lib/schemas";

// This is shared in-memory for the session (demo purposes)
let courses = [...coursesData];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const course = courses.find((c) => c.id === id);
    if (!course) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const parsed = CourseSchema.partial().safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
        }

        const index = courses.findIndex((c) => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        courses[index] = { ...courses[index], ...parsed.data } as any;
        return NextResponse.json(courses[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const index = courses.findIndex((c) => c.id === id);
    if (index === -1) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    courses = courses.filter((c) => c.id !== id);
    return NextResponse.json({ success: true });
}
