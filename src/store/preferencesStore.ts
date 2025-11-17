import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PreferencesState {
  focusAssist: boolean;
  darkTheme: boolean;
  liveWallpapers: boolean;
  clock24h: boolean;
  toggle: (_key: keyof Omit<PreferencesState, 'toggle'>) => void; // renomeado
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      focusAssist: true,
      darkTheme: true,
      liveWallpapers: false,
      clock24h: false,
      toggle: (_key) => set((s) => ({ [_key]: !s[_key] } as any)),
    }),
    { name: 'winweb-preferences' }
  )
);
