import { create } from "zustand";
import {
    coursesData,
    instructorsData,
    blogData,
    testimonials as testimonialsData,
    contactInfo as contactInfoData,
    type Course,
    type Instructor,
    type BlogPost,
} from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Testimonial {
    id: string;
    quote: string;
    name: string;
    title: string;
}

export interface ContactInfo {
    phones: string[];
    viber: string;
    whatsapp: string;
    addresses: string[];
}

interface AdminStore {
    // Auth
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;

    // Courses
    courses: Course[];
    addCourse: (course: Course) => void;
    updateCourse: (id: string, updates: Partial<Course>) => void;
    deleteCourse: (id: string) => void;

    // Instructors
    instructors: Instructor[];
    addInstructor: (instructor: Instructor) => void;
    updateInstructor: (id: string, updates: Partial<Instructor>) => void;
    deleteInstructor: (id: string) => void;

    // Blogs
    blogs: BlogPost[];
    addBlog: (post: BlogPost) => void;
    updateBlog: (id: string, updates: Partial<BlogPost>) => void;
    deleteBlog: (id: string) => void;

    // Testimonials
    testimonials: Testimonial[];
    addTestimonial: (t: Testimonial) => void;
    updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
    deleteTestimonial: (id: string) => void;

    // Contact Info
    contactInfo: ContactInfo;
    updateContactInfo: (updates: Partial<ContactInfo>) => void;
}

// ── Credentials (simple hardcoded for client-side demo) ──────────────────────
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "oryx2026";

// ── Seed testimonials with IDs ────────────────────────────────────────────────
const seededTestimonials: Testimonial[] = testimonialsData.map((t, i) => ({
    ...t,
    id: `testimonial-${i + 1}`,
}));

// ── Store ─────────────────────────────────────────────────────────────────────
export const useAdminStore = create<AdminStore>((set) => ({
    // Auth
    isAuthenticated: false,
    login: (username, password) => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            set({ isAuthenticated: true });
            return true;
        }
        return false;
    },
    logout: () => set({ isAuthenticated: false }),

    // Courses
    courses: coursesData,
    addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),
    updateCourse: (id, updates) =>
        set((state) => ({
            courses: state.courses.map((c) =>
                c.id === id ? { ...c, ...updates } : c
            ),
        })),
    deleteCourse: (id) =>
        set((state) => ({
            courses: state.courses.filter((c) => c.id !== id),
        })),

    // Instructors
    instructors: instructorsData,
    addInstructor: (instructor) =>
        set((state) => ({
            instructors: [...state.instructors, instructor],
        })),
    updateInstructor: (id, updates) =>
        set((state) => ({
            instructors: state.instructors.map((i) =>
                i.id === id ? { ...i, ...updates } : i
            ),
        })),
    deleteInstructor: (id) =>
        set((state) => ({
            instructors: state.instructors.filter((i) => i.id !== id),
        })),

    // Blogs
    blogs: blogData,
    addBlog: (post) =>
        set((state) => ({ blogs: [...state.blogs, post] })),
    updateBlog: (id, updates) =>
        set((state) => ({
            blogs: state.blogs.map((b) =>
                b.id === id ? { ...b, ...updates } : b
            ),
        })),
    deleteBlog: (id) =>
        set((state) => ({
            blogs: state.blogs.filter((b) => b.id !== id),
        })),

    // Testimonials
    testimonials: seededTestimonials,
    addTestimonial: (t) =>
        set((state) => ({
            testimonials: [...state.testimonials, t],
        })),
    updateTestimonial: (id, updates) =>
        set((state) => ({
            testimonials: state.testimonials.map((t) =>
                t.id === id ? { ...t, ...updates } : t
            ),
        })),
    deleteTestimonial: (id) =>
        set((state) => ({
            testimonials: state.testimonials.filter((t) => t.id !== id),
        })),

    // Contact Info
    contactInfo: contactInfoData,
    updateContactInfo: (updates) =>
        set((state) => ({
            contactInfo: { ...state.contactInfo, ...updates },
        })),
}));
