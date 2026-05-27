'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface AuctionTimerProps {
  endsAt: string;
}

function getRemaining(isoDate: string) {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, ended: false };
}

export default function AuctionTimer({ endsAt }: AuctionTimerProps) {
  const [remaining, setRemaining] = useState(getRemaining(endsAt));

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(endsAt)), 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (remaining.ended) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
        <Clock className="h-3 w-3" />
        Auction ended
      </span>
    );
  }

  const isUrgent = remaining.days === 0 && remaining.hours < 6;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isUrgent ? 'text-amber-400' : 'text-slate-400'}`}>
      <Clock className={`h-3 w-3 ${isUrgent ? 'animate-pulse' : ''}`} />
      {remaining.days > 0 && `${remaining.days}d `}
      {`${String(remaining.hours).padStart(2, '0')}:${String(remaining.minutes).padStart(2, '0')}:${String(remaining.seconds).padStart(2, '0')}`}
    </span>
  );
}
