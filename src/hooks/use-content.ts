import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Course, Instructor, BlogPost, Testimonial, ContactInfo } from "@/lib/api";

// ── Courses ──────────────────────────────────────────────────────────────────

export function useCourses() {
    return useQuery<Course[]>({
        queryKey: ["courses"],
        queryFn: async () => {
            const res = await fetch("/api/courses");
            if (!res.ok) throw new Error("Failed to fetch courses");
            return res.json();
        },
    });
}

export function useAddCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (course: Course) => {
            const res = await fetch("/api/courses", {
                method: "POST",
                body: JSON.stringify(course),
            });
            if (!res.ok) throw new Error("Failed to add course");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Course> }) => {
            const res = await fetch(`/api/courses/${id}`, {
                method: "PUT",
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error("Failed to update course");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/courses/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete course");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
}

// ── Instructors ──────────────────────────────────────────────────────────────

export function useInstructors() {
    return useQuery<Instructor[]>({
        queryKey: ["instructors"],
        queryFn: async () => {
            const res = await fetch("/api/instructors");
            if (!res.ok) throw new Error("Failed to fetch instructors");
            return res.json();
        },
    });
}

export function useAddInstructor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (instructor: Instructor) => {
            const res = await fetch("/api/instructors", {
                method: "POST",
                body: JSON.stringify(instructor),
            });
            if (!res.ok) throw new Error("Failed to add instructor");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instructors"] });
        },
    });
}

export function useUpdateInstructor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Instructor> }) => {
            const res = await fetch(`/api/instructors/${id}`, {
                method: "PUT",
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error("Failed to update instructor");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instructors"] });
        },
    });
}

export function useDeleteInstructor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/instructors/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete instructor");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instructors"] });
        },
    });
}

// ── Blogs ────────────────────────────────────────────────────────────────────

export function useBlogs() {
    return useQuery<BlogPost[]>({
        queryKey: ["blogs"],
        queryFn: async () => {
            const res = await fetch("/api/blogs");
            if (!res.ok) throw new Error("Failed to fetch blogs");
            return res.json();
        },
    });
}

export function useAddBlog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (blog: BlogPost) => {
            const res = await fetch("/api/blogs", {
                method: "POST",
                body: JSON.stringify(blog),
            });
            if (!res.ok) throw new Error("Failed to add blog post");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
}

export function useUpdateBlog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlogPost> }) => {
            const res = await fetch(`/api/blogs/${id}`, {
                method: "PUT",
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error("Failed to update blog post");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
}

export function useDeleteBlog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/blogs/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete blog post");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export function useTestimonials() {
    return useQuery<Testimonial[]>({
        queryKey: ["testimonials"],
        queryFn: async () => {
            const res = await fetch("/api/testimonials");
            if (!res.ok) throw new Error("Failed to fetch testimonials");
            return res.json();
        },
    });
}

export function useAddTestimonial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (testimonial: Testimonial) => {
            const res = await fetch("/api/testimonials", {
                method: "POST",
                body: JSON.stringify(testimonial),
            });
            if (!res.ok) throw new Error("Failed to add testimonial");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
}

export function useUpdateTestimonial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Testimonial> }) => {
            const res = await fetch(`/api/testimonials/${id}`, {
                method: "PUT",
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error("Failed to update testimonial");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
}

export function useDeleteTestimonial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/testimonials/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete testimonial");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
}

// ── Settings ─────────────────────────────────────────────────────────────────

export function useSettings() {
    return useQuery<ContactInfo>({
        queryKey: ["settings"],
        queryFn: async () => {
            const res = await fetch("/api/settings");
            if (!res.ok) throw new Error("Failed to fetch settings");
            return res.json();
        },
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updates: ContactInfo) => {
            const res = await fetch("/api/settings", {
                method: "PUT",
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error("Failed to update settings");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
    });
}
