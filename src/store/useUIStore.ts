import { create } from "zustand";

interface UIState {
    isMobileMenuOpen: boolean;
    selectedCourseId: string | null;
    toggleMobileMenu: () => void;
    setSelectedCourseId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isMobileMenuOpen: false,
    selectedCourseId: null,
    toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    setSelectedCourseId: (id) => set({ selectedCourseId: id }),
}));
