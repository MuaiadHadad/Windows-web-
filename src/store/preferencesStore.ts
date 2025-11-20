import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WallpaperId = 'dark' | 'light' | 'ocean' | 'custom';

export interface PreferencesState {
  focusAssist: boolean;
  darkTheme: boolean;
  liveWallpapers: boolean;
  clock24h: boolean;
  wallpaper: WallpaperId;
  customWallpaperUrl?: string | null;
  toggle: (_key: keyof Omit<PreferencesState, 'toggle' | 'wallpaper' | 'setWallpaper' | 'toggleTheme' | 'setCustomWallpaper' | 'clearCustomWallpaper' | 'customWallpaperUrl'>) => void;
  setWallpaper: (_wallpaper: WallpaperId) => void;
  setCustomWallpaper: (_url: string) => void;
  clearCustomWallpaper: () => void;
  toggleTheme: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      focusAssist: true,
      darkTheme: true,
      liveWallpapers: false,
      clock24h: false,
      wallpaper: 'dark',
      customWallpaperUrl: null,
      toggle: (_key) => set((s) => ({ [_key]: !s[_key] } as any)),
      setWallpaper: (wallpaper) => {
        set({ wallpaper });
      },
      setCustomWallpaper: (url) => {
        const safe = (url || '').trim();
        if (!safe) return;
        set({ customWallpaperUrl: safe, wallpaper: 'custom' });
      },
      clearCustomWallpaper: () => set({ customWallpaperUrl: null, wallpaper: get().darkTheme ? 'dark' : 'light' }),
      toggleTheme: () => {
        set((s) => {
          const nextDark = !s.darkTheme;
          const next: Partial<PreferencesState> = { darkTheme: nextDark };
          // Only auto-switch gradient wallpaper; keep custom as-is
          if (s.wallpaper === 'dark' || s.wallpaper === 'light') {
            next.wallpaper = nextDark ? 'dark' : 'light';
          }
          return next as PreferencesState;
        });
      },
    }),
    { name: 'winweb-preferences' }
  )
);
