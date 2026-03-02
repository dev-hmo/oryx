import { NextResponse } from "next/server";
import { testimonials as testimonialsData } from "@/lib/api";
import { TestimonialSchema } from "@/lib/schemas";

let testimonials = testimonialsData.map((t, i) => ({ ...t, id: t.id || `testimonial-${i + 1}` }));

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const testimonial = testimonials.find((t) => t.id === id);
    if (!testimonial) {
        return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const parsed = TestimonialSchema.partial().safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
        }

        const index = testimonials.findIndex((t) => t.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        testimonials[index] = { ...testimonials[index], ...parsed.data } as any;
        return NextResponse.json(testimonials[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const index = testimonials.findIndex((t) => t.id === id);
    if (index === -1) {
        return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    testimonials = testimonials.filter((t) => t.id !== id);
    return NextResponse.json({ success: true });
}
