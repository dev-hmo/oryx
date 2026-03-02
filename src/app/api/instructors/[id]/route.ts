import { NextResponse } from "next/server";
import { instructorsData } from "@/lib/api";
import { InstructorSchema } from "@/lib/schemas";

let instructors = [...instructorsData];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const instructor = instructors.find((i) => i.id === id);
    if (!instructor) {
        return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }
    return NextResponse.json(instructor);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const parsed = InstructorSchema.partial().safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
        }

        const index = instructors.findIndex((i) => i.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
        }

        instructors[index] = { ...instructors[index], ...parsed.data } as any;
        return NextResponse.json(instructors[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update instructor" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const index = instructors.findIndex((i) => i.id === id);
    if (index === -1) {
        return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    instructors = instructors.filter((i) => i.id !== id);
    return NextResponse.json({ success: true });
}
