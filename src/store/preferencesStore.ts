import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PreferencesState {
  focusAssist: boolean;
  darkTheme: boolean;
  liveWallpapers: boolean;
  toggle: (_key: keyof Omit<PreferencesState, 'toggle'>) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      focusAssist: true,
      darkTheme: true,
      liveWallpapers: false,
      toggle: (_key) => set((state) => ({ ...state, [_key]: !state[_key] })),
    }),
    { name: 'winweb-preferences' }
  )
);

