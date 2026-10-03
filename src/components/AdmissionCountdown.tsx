import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const DEADLINES = [
  { name: 'Public Universities', date: new Date('2026-10-31T23:59:59').getTime() },
  { name: 'Private Universities', date: new Date('2026-11-30T23:59:59').getTime() },
  { name: 'Other Institutions', date: new Date('2026-12-31T23:59:59').getTime() },
];

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  name?: string;
}

export default function AdmissionCountdown() {
  const [currentDeadlineIndex, setCurrentDeadlineIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});

  useEffect(() => {
    const timer = setInterval(() => {
      // Cycle through deadlines every 10 seconds
      const now = new Date().getTime();
      const index = Math.floor((now / 10000) % DEADLINES.length);
      setCurrentDeadlineIndex(index);
      
      const nextDeadline = DEADLINES[index];
      const distance = nextDeadline.date - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          name: nextDeadline.name
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft.days && !timeLeft.hours && !timeLeft.minutes) return null;

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white min-h-[32px] sm:min-h-[34px] py-1.5 px-3 sm:px-4 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-semibold text-center border-b border-blue-800/40 select-none leading-normal">
      <Clock size={13} className="text-cyan-400 shrink-0" />
      <span className="truncate max-w-full">
        <strong className="text-cyan-300 font-bold">{timeLeft.name}</strong> Deadline: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  );
};
