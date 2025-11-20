import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SnapZone {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface WindowSnapOverlayProps {
  isDragging: boolean;
  mouseX: number;
  mouseY: number;
}

/**
 * Visual overlay for window snap zones
 * Shows when user drags a window near screen edges
 */
export const WindowSnapOverlay: React.FC<WindowSnapOverlayProps> = ({ isDragging, mouseX, mouseY }) => {
  const [activeZone, setActiveZone] = useState<SnapZone | null>(null);
  const EDGE_THRESHOLD = 50; // pixels from edge to trigger snap zone

  useEffect(() => {
    if (!isDragging) {
      setActiveZone(null);
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const SAFE_BOTTOM = 80; // taskbar height

    // Check which zone the mouse is in
    let zone: SnapZone | null = null;

    if (mouseX < EDGE_THRESHOLD) {
      // Left edge
      zone = {
        x: 0,
        y: 0,
        width: vw / 2,
        height: vh - SAFE_BOTTOM,
        label: 'Snap Left',
      };
    } else if (mouseX > vw - EDGE_THRESHOLD) {
      // Right edge
      zone = {
        x: vw / 2,
        y: 0,
        width: vw / 2,
        height: vh - SAFE_BOTTOM,
        label: 'Snap Right',
      };
    } else if (mouseY < EDGE_THRESHOLD) {
      // Top edge (maximize)
      zone = {
        x: 0,
        y: 0,
        width: vw,
        height: vh - SAFE_BOTTOM,
        label: 'Maximize',
      };
    }

    setActiveZone(zone);
  }, [isDragging, mouseX, mouseY]);

  return (
    <AnimatePresence>
      {activeZone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            left: activeZone.x,
            top: activeZone.y,
            width: activeZone.width,
            height: activeZone.height,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className="border-4 border-violet-400/60 bg-violet-500/10 backdrop-blur-sm"
        >
          <div className="flex h-full w-full items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl bg-violet-500/90 px-6 py-3 text-lg font-semibold text-white shadow-2xl"
            >
              {activeZone.label}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

