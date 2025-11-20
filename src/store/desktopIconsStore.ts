import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface IconPosition {
  x: number;
  y: number;
}

interface DesktopIconsState {
  iconPositions: Record<string, IconPosition>;
  setIconPosition: (appId: string, x: number, y: number) => void;
  resetPositions: () => void;
}

const GRID_SIZE = 90; // Tamanho da grid para snap
const ICON_SPACING = 20; // Espaçamento entre ícones

// Posições padrão em grid vertical
const getDefaultPosition = (index: number): IconPosition => {
  const col = Math.floor(index / 6); // 6 ícones por coluna
  const row = index % 6;
  return {
    x: ICON_SPACING + col * GRID_SIZE,
    y: ICON_SPACING + row * GRID_SIZE,
  };
};

export const useDesktopIconsStore = create<DesktopIconsState>()(
  persist(
    (set) => ({
      iconPositions: {},
      setIconPosition: (appId, x, y) => {
        // Snap to grid
        const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
        const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;

        set((state) => ({
          iconPositions: {
            ...state.iconPositions,
            [appId]: { x: snappedX, y: snappedY },
          },
        }));
      },
      resetPositions: () => set({ iconPositions: {} }),
    }),
    {
      name: 'desktop-icons',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { GRID_SIZE, ICON_SPACING, getDefaultPosition };

