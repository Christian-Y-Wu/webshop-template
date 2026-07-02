'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

function diff(target: number) {
  const total = Math.max(0, target - Date.now());
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

export function Countdown({
  to,
  className,
  variant = 'inline',
}: {
  to: string;
  className?: string;
  variant?: 'inline' | 'boxed';
}) {
  const target = new Date(to).getTime();
  const [time, setTime] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  // Avoid hydration mismatch: server and first client render must match, so
  // show zeros until mounted, then tick with the live value.
  const t = mounted ? time : { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const pad = (n: number) => n.toString().padStart(2, '0');
  const units = [
    { label: 'Days', value: t.days },
    { label: 'Hrs', value: t.hours },
    { label: 'Min', value: t.minutes },
    { label: 'Sec', value: t.seconds },
  ];

  if (variant === 'boxed') {
    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-2.5">
            <div className="flex min-w-[56px] flex-col items-center rounded-xl bg-ink px-2 py-2 text-canvas">
              <span className="font-serif text-2xl tabular-nums leading-none">{pad(u.value)}</span>
              <span className="mt-1 text-[10px] uppercase tracking-widest text-canvas/60">{u.label}</span>
            </div>
            {i < units.length - 1 && <span className="text-lg text-ink-muted">:</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <span className={cn('font-medium tabular-nums', className)}>
      {pad(t.days)}d : {pad(t.hours)}h : {pad(t.minutes)}m : {pad(t.seconds)}s
    </span>
  );
}
