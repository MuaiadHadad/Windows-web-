import React, { useEffect, useState } from 'react';
import { usePreferencesStore } from '../../store/preferencesStore';

// Explicit time formatting to avoid server/client locale mismatch.
function formatTime(date: Date, hour12: boolean) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  });
}

const TaskbarClock: React.FC = () => {
  const { clock24h } = usePreferencesStore();
  const [time, setTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setTime(formatTime(new Date(), !clock24h));
    update();
    const id = setInterval(update, 30_000); // update every 30s
    return () => clearInterval(id);
  }, [clock24h]);

  if (!mounted) {
    // Avoid SSR mismatch: render empty placeholder until mounted.
    return <div className="px-2 text-xs opacity-0">--:--</div>;
  }
  return (
    <div className="px-3 py-1 text-sm font-semibold tracking-wide tabular-nums text-white/80">
      {time}
    </div>
  );
};

export default TaskbarClock;
