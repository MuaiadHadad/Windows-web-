import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PreferencesState {
  focusAssist: boolean;
  darkTheme: boolean;
  liveWallpapers: boolean;
  toggle: (key: keyof Omit<PreferencesState, 'toggle'>) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      focusAssist: true,
      darkTheme: true,
      liveWallpapers: false,
      toggle: (key) => set((s) => ({ [key]: !s[key] } as any)),
    }),
    { name: 'winweb-preferences' }
  )
);

