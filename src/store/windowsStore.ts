import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WindowInstance } from '../types/window';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
  maximized: boolean;
}

interface WindowsState {
  windows: WindowInstance[];
  lastLayouts: Record<string, Layout>; // per appId
  openWindow: (_appId: string, _title: string) => void;
  closeWindow: (_id: string) => void;
  minimizeWindow: (_id: string) => void;
  maximizeWindow: (_id: string) => void;
  focusWindow: (_id: string) => void;
  moveWindow: (_id: string, _x: number, _y: number) => void;
  resizeWindow: (_id: string, _width: number, _height: number) => void;
  setLastLayouts: (_layouts: Record<string, Layout>) => void;
}

const initialSize = { width: 500, height: 400 };

export const useWindowsStore = create<WindowsState>()(
  persist(
    (set, get) => ({
      windows: [],
      lastLayouts: {},
      openWindow: (appId, title) => {
        const topZ = get().windows.reduce((m, w) => Math.max(m, w.zIndex), 0) + 1;
        const saved = get().lastLayouts[appId];
        const newWindow: WindowInstance = {
          id: nanoid(),
          appId,
          title,
          x: saved?.x ?? 100 + Math.random() * 50,
          y: saved?.y ?? 100 + Math.random() * 50,
          width: saved?.width ?? initialSize.width,
          height: saved?.height ?? initialSize.height,
          minimized: false,
          maximized: saved?.maximized ?? false,
          zIndex: topZ,
        };
        set((s) => ({ windows: [...s.windows, newWindow] }));
      },
      closeWindow: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
      minimizeWindow: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)) })),
      maximizeWindow: (id) => set((s) => {
        const target = s.windows.find((w) => w.id === id);
        if (!target) return s;
        const nextMax = !target.maximized;
        const newWindows = s.windows.map((w) => (w.id === id ? { ...w, maximized: nextMax } : w));
        const newLayouts = {
          ...s.lastLayouts,
          [target.appId]: {
            x: target.x,
            y: target.y,
            width: target.width,
            height: target.height,
            maximized: nextMax,
          },
        };
        return { windows: newWindows, lastLayouts: newLayouts };
      }),
      focusWindow: (id) => {
        const topZ = get().windows.reduce((m, w) => Math.max(m, w.zIndex), 0) + 1;
        set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, zIndex: topZ } : w)) }));
      },
      moveWindow: (id, x, y) => set((s) => {
        const target = s.windows.find((w) => w.id === id);
        if (!target) return s;
        const newWindows = s.windows.map((w) => (w.id === id ? { ...w, x, y } : w));
        const newLayouts = {
          ...s.lastLayouts,
          [target.appId]: { x, y, width: target.width, height: target.height, maximized: target.maximized },
        };
        return { windows: newWindows, lastLayouts: newLayouts };
      }),
      resizeWindow: (id, width, height) => set((s) => {
        const target = s.windows.find((w) => w.id === id);
        if (!target) return s;
        const newWindows = s.windows.map((w) => (w.id === id ? { ...w, width, height } : w));
        const newLayouts = {
          ...s.lastLayouts,
          [target.appId]: { x: target.x, y: target.y, width, height, maximized: target.maximized },
        };
        return { windows: newWindows, lastLayouts: newLayouts };
      }),
      setLastLayouts: (layouts) => set({ lastLayouts: layouts || {} }),
    }),
    {
      name: 'windows-layouts',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => sessionStorage) : undefined,
      partialize: (state) => ({ lastLayouts: state.lastLayouts, windows: state.windows }),
    }
  )
);
