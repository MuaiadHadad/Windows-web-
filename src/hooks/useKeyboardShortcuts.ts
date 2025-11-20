import { useEffect } from 'react';
import { useWindowsStore } from '../store/windowsStore';
import { useUIStore } from '../store/uiStore';

/**
 * Global keyboard shortcuts hook for window management
 * Provides intuitive keyboard navigation and control
 */
export const useKeyboardShortcuts = () => {
  const windows = useWindowsStore((s) => s.windows);
  const closeWindow = useWindowsStore((s) => s.closeWindow);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowsStore((s) => s.maximizeWindow);
  const snapWindowToEdge = useWindowsStore((s) => s.snapWindowToEdge);
  const closeAllWindows = useWindowsStore((s) => s.closeAllWindows);
  const minimizeAllWindows = useWindowsStore((s) => s.minimizeAllWindows);
  const toggleStartMenu = useUIStore((s) => s.toggleStartMenu);
  const closeStartMenu = useUIStore((s) => s.closeStartMenu);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Get active window (highest zIndex, not minimized)
      const activeWindow = windows.reduce<typeof windows[0] | null>((acc, w) => {
        if (w.minimized) return acc;
        if (!acc) return w;
        return w.zIndex > acc.zIndex ? w : acc;
      }, null);

      // Cmd/Ctrl + W: Close active window
      if (cmdOrCtrl && e.key === 'w') {
        e.preventDefault();
        if (activeWindow) {
          closeWindow(activeWindow.id);
        }
      }

      // Cmd/Ctrl + M: Minimize active window
      if (cmdOrCtrl && e.key === 'm') {
        e.preventDefault();
        if (activeWindow) {
          minimizeWindow(activeWindow.id);
        }
      }

      // Cmd/Ctrl + Shift + F: Maximize/restore active window
      if (cmdOrCtrl && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        if (activeWindow) {
          maximizeWindow(activeWindow.id);
        }
      }

      // Cmd/Ctrl + Arrow: Snap window to edge
      if (cmdOrCtrl && activeWindow && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const edgeMap: Record<string, 'left' | 'right' | 'top' | 'bottom'> = {
          ArrowLeft: 'left',
          ArrowRight: 'right',
          ArrowUp: 'top',
          ArrowDown: 'bottom',
        };
        snapWindowToEdge(activeWindow.id, edgeMap[e.key]);
      }

      // Cmd/Ctrl + D: Minimize all windows (show desktop)
      if (cmdOrCtrl && e.key === 'd') {
        e.preventDefault();
        minimizeAllWindows();
      }

      // Cmd/Ctrl + Q: Close all windows
      if (cmdOrCtrl && e.shiftKey && e.key === 'Q') {
        e.preventDefault();
        closeAllWindows();
      }

      // Escape: Close start menu
      if (e.key === 'Escape') {
        closeStartMenu();
      }

      // Cmd/Ctrl + Space or Windows key: Toggle start menu
      if ((cmdOrCtrl && e.key === ' ') || e.key === 'Meta') {
        e.preventDefault();
        toggleStartMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windows, closeWindow, minimizeWindow, maximizeWindow, snapWindowToEdge, closeAllWindows, minimizeAllWindows, toggleStartMenu, closeStartMenu]);
};

