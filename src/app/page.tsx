import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { CoursesSection } from "@/components/sections/courses";
import { TeamSection } from "@/components/sections/team";
import { BlogSection } from "@/components/sections/blog";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#050a18] text-neutral-900 dark:text-white selection:bg-brand-500/30">
      <Navbar />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <CoursesSection />
      <div id="team">
        <TeamSection />
      </div>
      <div id="blog">
        <BlogSection />
      </div>
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <ContactSection />
      <Footer />
    </main>
  );
}
