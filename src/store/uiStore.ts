import { create } from 'zustand';

interface UIState {
  startMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  selectedDesktopIconId: string | null;
  selectDesktopIcon: (_id: string) => void;
  clearDesktopIconSelection: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  startMenuOpen: false,
  toggleStartMenu: () => set((s) => ({ startMenuOpen: !s.startMenuOpen })),
  closeStartMenu: () => set({ startMenuOpen: false }),
  selectedDesktopIconId: null,
  selectDesktopIcon: (id) => set({ selectedDesktopIconId: id }),
  clearDesktopIconSelection: () => set({ selectedDesktopIconId: null }),
}));
