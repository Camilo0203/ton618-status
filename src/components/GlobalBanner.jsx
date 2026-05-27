import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

function resolveGlobal(results) {
  if (!results) return 'loading';
  const statuses = Object.entries(results)
    .filter(([k]) => k !== 'checkedAt')
    .map(([, v]) => v.status);
  if (statuses.every(s => s === 'operational')) return 'operational';
  if (statuses.some(s => s === 'outage')) return 'outage';
  return 'degraded';
}

const CONFIG = {
  operational: {
    bg: 'bg-green-500/10 border-green-500/20',
    icon: CheckCircle,
    iconClass: 'text-green-400',
    title: 'All systems operational',
    sub: 'Every service is running normally.',
  },
  degraded: {
    bg: 'bg-yellow-400/10 border-yellow-400/20',
    icon: AlertTriangle,
    iconClass: 'text-yellow-400',
    title: 'Partial service disruption',
    sub: 'Some services are experiencing issues.',
  },
  outage: {
    bg: 'bg-red-500/10 border-red-500/20',
    icon: XCircle,
    iconClass: 'text-red-400',
    title: 'Service outage detected',
    sub: 'One or more services are down. We are investigating.',
  },
  loading: {
    bg: 'bg-gray-700/20 border-gray-700/30',
    icon: AlertTriangle,
    iconClass: 'text-gray-500',
    title: 'Checking services…',
    sub: 'Running status checks.',
  },
};

export default function GlobalBanner({ results }) {
  const global = resolveGlobal(results);
  const { bg, icon: Icon, iconClass, title, sub } = CONFIG[global];

  return (
    <div className={`rounded-2xl border p-6 flex items-center gap-4 ${bg} animate-fade-in`}>
      <Icon size={32} className={`${iconClass} flex-shrink-0`} />
      <div>
        <div className="font-bold text-white text-lg">{title}</div>
        <div className="text-sm text-gray-400 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
