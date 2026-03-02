import { NextResponse } from "next/server";
import { blogData } from "@/lib/api";
import { BlogSchema } from "@/lib/schemas";

let blogs = [...blogData];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const blog = blogs.find((b) => b.id === id);
    if (!blog) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const parsed = BlogSchema.partial().safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
        }

        const index = blogs.findIndex((b) => b.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        blogs[index] = { ...blogs[index], ...parsed.data } as any;
        return NextResponse.json(blogs[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const index = blogs.findIndex((b) => b.id === id);
    if (index === -1) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    blogs = blogs.filter((b) => b.id !== id);
    return NextResponse.json({ success: true });
}
