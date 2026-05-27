import React from 'react';
import StatusBadge from './StatusBadge.jsx';
import UptimeBar from './UptimeBar.jsx';

export default function ServiceCard({ name, description, icon: Icon, result, history }) {
  const status = result?.status || 'unknown';
  const latency = result?.latency;
  const detail = result?.detail;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4 animate-slide-up hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-accent-glow" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">{name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{description}</div>
          </div>
        </div>
        <StatusBadge status={status} size="sm" />
      </div>

      <UptimeBar history={history} />

      <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
        {latency != null && (
          <span>
            <span className="text-gray-400">{latency}</span> ms
          </span>
        )}
        {detail && (
          <span className="truncate">{detail}</span>
        )}
      </div>
    </div>
  );
}
