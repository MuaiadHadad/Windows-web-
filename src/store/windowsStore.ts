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
  snapWindowToEdge: (_id: string, _edge: 'left' | 'right' | 'top' | 'bottom') => void;
  closeAllWindows: () => void;
  minimizeAllWindows: () => void;
}

const initialSize = { width: 500, height: 400 };
const SAFE_BOTTOM = 16 + 64;

function renumberZ(windows: WindowInstance[], topId?: string): WindowInstance[] {
  // Sort by current zIndex asc to preserve relative ordering, then optionally move topId to the end
  const ordered = [...windows].sort((a, b) => a.zIndex - b.zIndex);
  if (topId) {
    const idx = ordered.findIndex((w) => w.id === topId);
    if (idx !== -1) {
      const [top] = ordered.splice(idx, 1);
      ordered.push(top);
    }
  }
  return ordered.map((w, i) => ({ ...w, zIndex: i + 1 }));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export const useWindowsStore = create<WindowsState>()(
  persist(
    (set, get) => ({
      windows: [],
      lastLayouts: {},
      openWindow: (appId, title) => {
        const saved = get().lastLayouts[appId];
        const base = {
          x: saved?.x ?? 100 + Math.random() * 50,
          y: saved?.y ?? 100 + Math.random() * 50,
          width: saved?.width ?? initialSize.width,
          height: saved?.height ?? initialSize.height,
          maximized: saved?.maximized ?? false,
        };
        // Clamp to viewport if possible (only on client)
        let x = base.x;
        let y = base.y;
        let width = base.width;
        let height = base.height;
        if (typeof window !== 'undefined') {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          width = clamp(width, 300, vw);
          height = clamp(height, 200, Math.max(200, vh - SAFE_BOTTOM));
          x = clamp(x, 0, Math.max(0, vw - width));
          y = clamp(y, 0, Math.max(0, vh - SAFE_BOTTOM - height));
        }
        const newWindow: WindowInstance = {
          id: nanoid(),
          appId,
          title,
          x,
          y,
          width,
          height,
          minimized: false,
          maximized: base.maximized,
          zIndex: (get().windows.length || 0) + 1,
        };
        set((s) => {
          const windows = renumberZ([...s.windows, newWindow], newWindow.id);
          return { windows };
        });
      },
      closeWindow: (id) => set((s) => ({ windows: renumberZ(s.windows.filter((w) => w.id !== id)) })),
      minimizeWindow: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)) })),
      maximizeWindow: (id) => set((s) => {
        const target = s.windows.find((w) => w.id === id);
        if (!target) return s;
        const nextMax = !target.maximized;
        const updated = s.windows.map((w) => (w.id === id ? { ...w, maximized: nextMax } : w));
        const windows = renumberZ(updated, id);
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
        return { windows, lastLayouts: newLayouts };
      }),
      focusWindow: (id) => {
        set((s) => ({ windows: renumberZ(s.windows, id) }));
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
      snapWindowToEdge: (id, edge) => set((s) => {
        const target = s.windows.find((w) => w.id === id);
        if (!target || typeof window === 'undefined') return s;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let x = target.x;
        let y = target.y;
        let width = target.width;
        let height = target.height;

        switch (edge) {
          case 'left':
            x = 0;
            y = 0;
            width = vw / 2;
            height = vh - SAFE_BOTTOM;
            break;
          case 'right':
            x = vw / 2;
            y = 0;
            width = vw / 2;
            height = vh - SAFE_BOTTOM;
            break;
          case 'top':
            x = 0;
            y = 0;
            width = vw;
            height = (vh - SAFE_BOTTOM) / 2;
            break;
          case 'bottom':
            x = 0;
            y = (vh - SAFE_BOTTOM) / 2;
            width = vw;
            height = (vh - SAFE_BOTTOM) / 2;
            break;
        }

        const newWindows = s.windows.map((w) =>
          w.id === id ? { ...w, x, y, width, height, maximized: false } : w
        );
        const windows = renumberZ(newWindows, id);
        const newLayouts = {
          ...s.lastLayouts,
          [target.appId]: { x, y, width, height, maximized: false },
        };
        return { windows, lastLayouts: newLayouts };
      }),
      closeAllWindows: () => set({ windows: [] }),
      minimizeAllWindows: () => set((s) => ({
        windows: s.windows.map((w) => ({ ...w, minimized: true }))
      })),
    }),
    {
      name: 'windows-layouts',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => sessionStorage) : undefined,
      partialize: (state) => ({ lastLayouts: state.lastLayouts, windows: state.windows }),
    }
  )
);
