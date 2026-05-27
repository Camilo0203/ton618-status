import React from 'react';
import {
  Bot,
  Database,
  Globe,
  Layers,
  ShoppingCart,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { useStatusPoller } from './hooks/useStatusPoller.js';
import GlobalBanner from './components/GlobalBanner.jsx';
import ServiceCard from './components/ServiceCard.jsx';

const SERVICES = [
  {
    key: 'bot',
    name: 'Discord Bot',
    description: 'Commands, events & interactions',
    icon: Bot,
  },
  {
    key: 'website',
    name: 'Website',
    description: 'ton618bot.xyz landing & dashboard',
    icon: Globe,
  },
  {
    key: 'database',
    name: 'Database (MongoDB)',
    description: 'Primary data store',
    icon: Database,
  },
  {
    key: 'supabase',
    name: 'Supabase',
    description: 'Auth, billing & realtime',
    icon: Layers,
  },
  {
    key: 'tebex',
    name: 'Tebex Payments',
    description: 'Checkout & payment processing',
    icon: ShoppingCart,
  },
];

export default function App() {
  const { results, history, loading, refresh } = useStatusPoller();

  const lastChecked = results?.checkedAt
    ? new Date(results.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div className="min-h-screen bg-surface text-white">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity size={20} className="text-accent-glow" />
            <span className="font-bold text-white tracking-tight">TON618 Status</span>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-40"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {lastChecked ? `Updated ${lastChecked}` : 'Checking…'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Global status banner */}
        <section>
          <GlobalBanner results={loading ? null : results} />
        </section>

        {/* Service cards */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Services
          </h2>

          {loading ? (
            <div className="space-y-4">
              {SERVICES.map(s => (
                <div key={s.key} className="bg-card border border-border rounded-xl p-5 h-28 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {SERVICES.map(({ key, name, description, icon }) => (
                <ServiceCard
                  key={key}
                  name={name}
                  description={description}
                  icon={icon}
                  result={results?.[key]}
                  history={history[key] || []}
                />
              ))}
            </div>
          )}
        </section>

        {/* Info footer */}
        <section className="text-xs text-gray-600 text-center space-y-1 pb-4">
          <p>Status checks run every {Math.round(parseInt(import.meta.env.VITE_POLL_INTERVAL_MS || '60000') / 1000)}s from your browser.</p>
          <p>
            Need help?{' '}
            <a
              href={import.meta.env.VITE_SUPPORT_URL || 'https://discord.gg/ton618'}
              className="text-accent-glow hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join our Discord
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
