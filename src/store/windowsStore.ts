import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WindowInstance } from '../types/window';

interface WindowsState {
  windows: WindowInstance[];
  openWindow: (appId: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
}

const initialSize = { width: 500, height: 400 };

export const useWindowsStore = create<WindowsState>((set, get) => ({
  windows: [],
  openWindow: (appId, title) => {
    const topZ = get().windows.reduce((m, w) => Math.max(m, w.zIndex), 0) + 1;
    const newWindow: WindowInstance = {
      id: nanoid(),
      appId,
      title,
      x: 100 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      width: initialSize.width,
      height: initialSize.height,
      minimized: false,
      maximized: false,
      zIndex: topZ,
    };
    set((s) => ({ windows: [...s.windows, newWindow] }));
  },
  closeWindow: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
  minimizeWindow: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)) })),
  maximizeWindow: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) })),
  focusWindow: (id) => {
    const topZ = get().windows.reduce((m, w) => Math.max(m, w.zIndex), 0) + 1;
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, zIndex: topZ } : w)) }));
  },
  moveWindow: (id, x, y) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)) })),
  resizeWindow: (id, width, height) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, width, height } : w)) })),
}));

