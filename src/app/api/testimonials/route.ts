import { NextResponse } from "next/server";
import { testimonials as testimonialsData } from "@/lib/api";
import { TestimonialSchema } from "@/lib/schemas";

let testimonials = testimonialsData.map((t, i) => ({ ...t, id: t.id || `testimonial-${i + 1}` }));

export async function GET() {
    return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = TestimonialSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
        }

        const newTestimonial = { ...parsed.data };
        testimonials = [...testimonials, newTestimonial as any];

        return NextResponse.json(newTestimonial, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
    }
}
