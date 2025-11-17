import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WallpaperId = 'dark' | 'light' | 'ocean';

export interface PreferencesState {
  focusAssist: boolean;
  darkTheme: boolean;
  liveWallpapers: boolean;
  clock24h: boolean;
  wallpaper: WallpaperId;
  toggle: (_key: keyof Omit<PreferencesState, 'toggle' | 'wallpaper' | 'setWallpaper' | 'toggleTheme'>) => void;
  setWallpaper: (_wallpaper: WallpaperId) => void;
  toggleTheme: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      focusAssist: true,
      darkTheme: true,
      liveWallpapers: false,
      clock24h: false,
      wallpaper: 'dark',
      toggle: (_key) => set((s) => ({ [_key]: !s[_key] } as any)),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      toggleTheme: () => set((state) => ({ darkTheme: !state.darkTheme })),
    }),
    { name: 'winweb-preferences' }
  )
);
