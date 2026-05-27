import React from 'react';

const CONFIG = {
  operational: {
    dot: 'bg-green-400',
    ring: 'ring-green-500/30',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    label: 'Operational',
    animate: true,
  },
  degraded: {
    dot: 'bg-yellow-400',
    ring: 'ring-yellow-400/30',
    text: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    label: 'Degraded',
    animate: true,
  },
  outage: {
    dot: 'bg-red-400',
    ring: 'ring-red-400/30',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    label: 'Outage',
    animate: false,
  },
  unknown: {
    dot: 'bg-gray-500',
    ring: 'ring-gray-500/20',
    text: 'text-gray-400',
    bg: 'bg-gray-500/10',
    label: 'Unknown',
    animate: false,
  },
};

export default function StatusBadge({ status, size = 'md' }) {
  const c = CONFIG[status] || CONFIG.unknown;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${textSize} ${c.text} ${c.bg} ring-1 ${c.ring}`}>
      <span className={`${dotSize} rounded-full ${c.dot} ${c.animate ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  );
}
