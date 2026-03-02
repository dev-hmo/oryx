import { NextResponse } from "next/server";
import { coursesData } from "@/lib/api";
import { CourseSchema } from "@/lib/schemas";
import { signJwt } from "@/lib/auth"; // For middleware verification if needed

// In-memory data for now (since no DB is connected)
let courses = [...coursesData];

export async function GET() {
    return NextResponse.json(courses);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = CourseSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
        }

        const newCourse = { ...parsed.data };
        courses = [...courses, newCourse as any];

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
    }
}
