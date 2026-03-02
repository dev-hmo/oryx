import { NextResponse } from "next/server";
import { blogData } from "@/lib/api";
import { BlogSchema } from "@/lib/schemas";

let blogs = [...blogData];

export async function GET() {
    return NextResponse.json(blogs);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = BlogSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
        }

        const newBlog = { ...parsed.data };
        blogs = [...blogs, newBlog as any];

        return NextResponse.json(newBlog, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
    }
}
