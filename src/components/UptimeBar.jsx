import React from 'react';

const COLOR = {
  operational: 'bg-green-400',
  degraded: 'bg-yellow-400',
  outage: 'bg-red-400',
  unknown: 'bg-gray-600',
};

export default function UptimeBar({ history = [] }) {
  const total = history.length;
  const upCount = history.filter(s => s === 'operational').length;
  const pct = total > 0 ? Math.round((upCount / total) * 100) : 100;

  const placeholders = Math.max(0, 90 - total);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-0.5 h-6">
        {Array.from({ length: placeholders }).map((_, i) => (
          <div key={`ph-${i}`} className="flex-1 h-full rounded-sm bg-gray-700/40" />
        ))}
        {history.map((s, i) => (
          <div
            key={i}
            title={s}
            className={`flex-1 h-full rounded-sm transition-colors ${COLOR[s] || COLOR.unknown}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-mono">
        <span>90 checks ago</span>
        <span className={pct === 100 ? 'text-green-400' : pct >= 90 ? 'text-yellow-400' : 'text-red-400'}>
          {pct}% uptime
        </span>
        <span>now</span>
      </div>
    </div>
  );
}
