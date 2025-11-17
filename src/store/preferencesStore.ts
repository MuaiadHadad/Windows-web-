import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PreferencesState {
  focusAssist: boolean;
  darkTheme: boolean;
  liveWallpapers: boolean;
<<<<<<< HEAD
  clock24h: boolean;
  toggle: (_key: keyof Omit<PreferencesState, 'toggle'>) => void; // renomeado
=======
  toggle: (_key: keyof Omit<PreferencesState, 'toggle'>) => void;
>>>>>>> origin/main
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      focusAssist: true,
      darkTheme: true,
      liveWallpapers: false,
<<<<<<< HEAD
      clock24h: false,
      toggle: (_key) => set((s) => ({ [_key]: !s[_key] } as any)),
=======
      toggle: (_key) => set((state) => ({ ...state, [_key]: !state[_key] })),
>>>>>>> origin/main
    }),
    { name: 'winweb-preferences' }
  )
);
