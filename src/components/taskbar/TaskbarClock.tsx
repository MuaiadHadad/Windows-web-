import React, { useEffect, useState } from 'react';

// Explicit time formatting to avoid server/client locale mismatch.
function formatTime(date: Date, hour12: boolean) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  });
}

const TaskbarClock: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Always force hour12 true here (can later read preference store)
    const update = () => setTime(formatTime(new Date(), true));
    update();
    const id = setInterval(update, 30_000); // update every 30s
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    // Avoid SSR mismatch: render empty placeholder until mounted.
    return <div className="px-2 text-xs opacity-0">--:--</div>;
  }
  return (
    <div className="px-2 text-sm font-medium tracking-wide tabular-nums">{time}</div>
  );
};

export default TaskbarClock;

