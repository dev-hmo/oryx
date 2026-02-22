// Real ORYX Training Center course data

export interface Course {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    duration: string;
    fee: string;
    schedule: string;
    time: string;
    startDate: string;
    batch: string;
    icon: string;
    category: "hospitality" | "culinary" | "maritime" | "operations";
}

export const coursesData: Course[] = [
    {
        id: "fb-service",
        title: "Food & Beverage Service",
        subtitle: "Professional Service Staff Training",
        description:
            "Master international service standards for Hotel, Restaurant, Cruise & Overseas Hospitality Industry. Theory + Practical combined training to become job-ready.",
        highlights: [
            "Restaurant & Table Setup",
            "Professional Order Taking",
            "Service Etiquette & Grooming",
            "Food Safety & Hygiene",
            "Upselling Techniques",
            "Real Service Practice",
        ],
        duration: "6 Weeks",
        fee: "300,000 MMK",
        schedule: "Wed, Thu, Fri",
        time: "9:00 AM – 12:00 PM",
        startDate: "25 Feb 2026",
        batch: "Batch 5",
        icon: "🍽️",
        category: "hospitality",
    },
    {
        id: "chef-training",
        title: "Chef / Food Production",
        subtitle: "Professional Chef Career Training",
        description:
            "International Standard culinary training for Middle East, Singapore & Cruise Industry. Learn from a Senior Executive Chef with 30+ years of experience.",
        highlights: [
            "Kitchen Workflow & Organization",
            "Food Safety, Hygiene & Sanitation",
            "Professional Knife Skills",
            "Western & Asian Cooking Methods",
            "Stocks, Soups & Sauces",
            "Menu Planning & Food Cost Control",
        ],
        duration: "1.5 Months",
        fee: "300,000 MMK",
        schedule: "Sat, Sun",
        time: "9:00 AM – 12:00 PM",
        startDate: "21 Feb 2026",
        batch: "Batch 5",
        icon: "👨‍🍳",
        category: "culinary",
    },
    {
        id: "cruise-career",
        title: "Cruise Ship Career",
        subtitle: "Complete Maritime Career Program",
        description:
            "Comprehensive cruise ship career training covering Galley Utility, Housekeeping, Cabin Steward, F&B Attendant, and Laundry Master positions. Includes special interview training for Cooks.",
        highlights: [
            "Galley Utility",
            "Housekeeping Utility",
            "Cabin Steward Training",
            "F&B Attendant (Waiter/Waitress)",
            "Interview & Grooming Training",
            "Cruise Line Standards Preparation",
        ],
        duration: "1 Month",
        fee: "300,000 MMK",
        schedule: "Tue, Wed, Thu",
        time: "1:00 PM – 4:00 PM",
        startDate: "27 Jan 2026",
        batch: "Batch 5",
        icon: "🚢",
        category: "maritime",
    },
    {
        id: "hotel-operation",
        title: "Hotel Operation",
        subtitle: "Complete Hotel Management Bundle",
        description:
            "All-in-one hotel training: Housekeeping + Front Office + F&B Services combined. Build core operational skills for the Hotel Industry from foundation to professional level.",
        highlights: [
            "Housekeeping Operation",
            "Front Office Operation",
            "F&B Services Operation",
            "Industry-oriented Training",
            "Real Operational Knowledge",
            "Professional Confidence Building",
        ],
        duration: "3 Months",
        fee: "600,000 MMK",
        schedule: "Mon – Fri",
        time: "9:00 AM – 12:00 PM",
        startDate: "5 Jan 2026",
        batch: "Batch 5",
        icon: "🏨",
        category: "operations",
    },
    {
        id: "galley-utility",
        title: "Galley Utility Operation",
        subtitle: "Kitchen Support & Hygiene Specialist",
        description:
            "Specialist training for cruise ship galley operations. Learn USPH & HACCP international hygiene standards, chemical handling, and professional galley workflow.",
        highlights: [
            "Dishwashing & Pot Washing Procedures",
            "Galley Area Cleaning & Sanitation",
            "Waste Management & Segregation",
            "Chemical Handling & SDS",
            "USPH & HACCP Standards",
            "Equipment Safe Handling & Storage",
        ],
        duration: "6 Weeks",
        fee: "300,000 MMK",
        schedule: "Wed, Thu",
        time: "9:00 AM – 12:00 PM",
        startDate: "31 Dec 2025",
        batch: "Batch 3",
        icon: "🔪",
        category: "maritime",
    },
    {
        id: "housekeeping",
        title: "Housekeeping Operation",
        subtitle: "International Standard Room Management",
        description:
            "Hotel & Cruise Industry housekeeping training with international standards. Theory + Practical from experienced trainers with 30+ years in the industry.",
        highlights: [
            "Department Overview & Roles",
            "Hotel Standard & SOP",
            "Cleaning Chemicals & Equipment",
            "Guest Room Types & Cleaning Sequence",
            "Hygiene, Safety & Workplace Etiquette",
            "Communication & Professional Attitude",
        ],
        duration: "6 Weeks",
        fee: "300,000 MMK",
        schedule: "Mon – Fri",
        time: "9:00 AM – 12:00 PM",
        startDate: "Coming Soon",
        batch: "Batch 6",
        icon: "🧹",
        category: "operations",
    },
];

export const contactInfo = {
    phones: ["09 777 379 000", "09 777 118 720"],
    viber: "+959 421 139 022",
    whatsapp: "+959 421 139 022",
    addresses: [
        "No.277, Corner of Seikkantha Road & Bogyoke Aung San Road, Asia Plaza, Kyauktada Township, Yangon",
        "No.1, Bo Son Pack Street, Bo Tun Zan Quarter, Daw Pone Township, Yangon, Myanmar",
    ],
};

export const testimonials = [
    {
        quote:
            "The culinary training I received here was exceptional. Within a month of graduating, I was placed on a major luxury cruise line. It changed my life.",
        name: "John Davies",
        title: "Commis Chef, Royal Caribbean",
    },
    {
        quote:
            "The practical simulations and STCW preparation made the transition to sea life so much easier. I felt completely ready on my first day.",
        name: "Maria Garcia",
        title: "Guest Services, Princess Cruises",
    },
    {
        quote:
            "I started with zero experience in hospitality. The Front Office Management course taught me everything, and the placement cell got me a job in a 5-star hotel.",
        name: "David Chen",
        title: "Front Desk Supervisor, Marriott",
    },
    {
        quote:
            "Learning from industry veterans gave me insights you can't find in textbooks. The food and beverage service techniques are top-notch.",
        name: "Sarah Jenkins",
        title: "F&B Manager, Hilton Hotels",
    },
    {
        quote:
            "The disciplined environment and rigorous training standard taught me professionalism. Highly recommend for anyone serious about a cruise career.",
        name: "Michael O'Connor",
        title: "Cabin Steward, MSC Cruises",
    },
];

// Mock API fetch for Tanstack Query
export async function fetchCourses(): Promise<Course[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return coursesData;
}

// New Instructor Data
export interface Instructor {
    id: string;
    name: string;
    role: string;
    experience: string;
    bio: string;
    image: string;
    expertise: string[];
}

export const instructorsData: Instructor[] = [
    {
        id: "inst-1",
        name: "Chef Marcus Lin",
        role: "Executive Culinary Director",
        experience: "25+ Years",
        bio: "Former Executive Chef at Ritz-Carlton Singapore. Specialist in international cuisine and high-volume cruise ship food production management.",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
        expertise: ["Menu Planning", "Western Cuisine", "Galley Operations"],
    },
    {
        id: "inst-2",
        name: "Sarah Jenkins",
        role: "Head of Hospitality",
        experience: "15+ Years",
        bio: "Experienced Housekeeping Executive from Princess Cruises. Certified international trainer for 5-star standard room management.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
        expertise: ["Housekeeping SOPs", "Chemical Handling", "Guest Relations"],
    },
    {
        id: "inst-3",
        name: "Captain David Moe",
        role: "Maritime Operations Lead",
        experience: "30+ Years",
        bio: "Veteran Master Mariner with deep knowledge of cruise ship protocols. Specializes in STCW Standards and marine safety training.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
        expertise: ["Maritime Safety", "STCW", "Crew Resource Management"],
    },
    {
        id: "inst-4",
        name: "Elena Rodriguez",
        role: "F&B Service Manager",
        experience: "12+ Years",
        bio: "Former Maitre D' at Carnival Cruise Line. Passionate about teaching fine dining etiquette, wine pairing, and exceptional customer service.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
        expertise: ["Fine Dining Service", "Wine Knowledge", "Upselling Techniques"],
    },
];

// New Blog/Activities Data
export interface BlogPost {
    id: string;
    title: string;
    category: "News" | "Event" | "Success Story" | "Guide";
    date: string;
    excerpt: string;
    image: string;
    readTime: string;
}

export const blogData: BlogPost[] = [
    {
        id: "blog-1",
        title: "ORYX Batch 4 Graduates Secure Placements on Royal Caribbean",
        category: "Success Story",
        date: "Feb 15, 2026",
        excerpt: "We are thrilled to announce that 45 students from our recent cruise ship career batch have successfully cleared their interviews.",
        image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
        readTime: "3 min read",
    },
    {
        id: "blog-2",
        title: "Masterclass: Modern Plating Techniques with Chef Marcus",
        category: "Event",
        date: "Feb 02, 2026",
        excerpt: "Join us for an exclusive 2-day practical workshop on modern culinary presentation, essential for 5-star hotel kitchens.",
        image: "https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=800&q=80",
        readTime: "2 min read",
    },
    {
        id: "blog-3",
        title: "Essential STCW Certifications for Cruise Ship Jobs",
        category: "Guide",
        date: "Jan 28, 2026",
        excerpt: "A comprehensive guide on what STCW certificates you need before applying for your first maritime hospitality position.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
        readTime: "5 min read",
    },
];

// Mock API fetchers
export async function fetchInstructors(): Promise<Instructor[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return instructorsData;
}

export async function fetchBlogs(): Promise<BlogPost[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return blogData;
}
