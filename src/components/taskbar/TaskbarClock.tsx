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

function formatDate(date: Date) {
  // Short date (e.g., 17/11/2025) using Portuguese locale
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const TaskbarClock: React.FC = () => {
  const { clock24h } = usePreferencesStore();
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(formatTime(now, !clock24h));
      setDate(formatDate(now));
    };
    update();
    const id = setInterval(update, 60_000); // update every minute
    return () => clearInterval(id);
  }, [clock24h]);

  if (!mounted) {
    // Avoid SSR mismatch: render empty placeholder until mounted.
    return <div className="px-2 text-xs opacity-0">--:--\n--/--/----</div>;
  }
  return (
    <div className="flex flex-col items-end px-3 py-1 text-white/80 leading-tight">
      <div className="text-sm font-semibold tracking-wide tabular-nums">{time}</div>
      <div className="text-[10px] font-medium tracking-wide tabular-nums text-white/60">{date}</div>
    </div>
  );
};

export default TaskbarClock;
