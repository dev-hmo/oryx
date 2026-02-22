# ORYX Training Center Landing Page

A premium, modern, and responsive landing page for the ORYX Hospitality & Cruise Shipping Training Center. Built with a focus on immersive aesthetics—featuring scroll-triggered animations, interactive glassmorphism UI components, and full Light/Dark mode support.

## 🚀 Features

- **Dual Theme Support**: Beautifully configured Light and Dark modes with a custom mesh gradient for the dark theme.
- **Scroll Animations**: Smooth entrance animations powered by Framer Motion.
- **Premium UI Components**: Built using Aceternity UI concepts (Bento Grids, Infinite Moving Cards, Spotlight effects).
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop viewing.
- **Dynamic Data Rendering**: Mocked API integration using React Query for Courses, Instructors, and Campus News.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Client-side UI State) & React Context API
- **Data Fetching**: [Tanstack Query (React Query) v5](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Utilities**: `clsx`, `tailwind-merge`

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js 18.x or later installed.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd orxy
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn / pnpm / bun
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗂️ Project Structure

- **`src/app/`**: Next.js App Router routing logic and main pages (`page.tsx`, `layout.tsx`, `globals.css`).
- **`src/components/sections/`**: High-level individual landing page components (Hero, Features, Courses, Team, Blog, etc.).
- **`src/components/ui/`**: Reusable, atomic UI components and animated widgets.
- **`src/components/providers/`**: React Context providers (e.g., `ThemeProvider` and `QueryProvider`).
- **`src/lib/`**: Utility functions (`cn`) and mocked API data (`api.ts`).
- **`src/store/`**: Zustand global state configuration.

## 🎨 Theming (Tailwind v4)

This project utilizes Tailwind CSS v4's class-based dark mode architecture via the `@custom-variant dark (&:is(.dark, .dark *));` directive in `globals.css`. 

The user's preferred theme is persisted locally via `localStorage` allowing the `ThemeProvider` to prevent styling hydration mismatches on page load. Light mode is heavily optimized with light slate elements and brand blues, whereas dark mode turns those elements into deep navy glassmorphism structures.
