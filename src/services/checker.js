/**
 * Service checker — probes each endpoint and returns a normalized status.
 *
 * All checks run from the browser, so they hit public URLs only.
 * Sensitive internal endpoints (MongoDB, Supabase internals) are proxied
 * through the bot's /health endpoint, which aggregates them safely.
 */

const TIMEOUT_MS = 8000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Check the bot health endpoint.
 * Returns status + partial detail from the /health JSON payload.
 */
export async function checkBot() {
  const url = import.meta.env.VITE_BOT_HEALTH_URL || 'https://ton618-bot.squareweb.app/health';
  const start = Date.now();
  try {
    const res = await fetchWithTimeout(url);
    const latency = Date.now() - start;
    if (!res.ok) return { status: 'degraded', latency, detail: `HTTP ${res.status}` };
    const json = await res.json().catch(() => ({}));
    const isHealthy = json.status === 'healthy' || json.status === 'ok';
    return {
      status: isHealthy ? 'operational' : 'degraded',
      latency,
      detail: json.status || 'ok',
      uptime: json.uptime,
    };
  } catch (err) {
    return { status: 'outage', latency: null, detail: err.name === 'AbortError' ? 'Timeout' : 'Unreachable' };
  }
}

/**
 * Check MongoDB status — read from the bot's /health aggregated response.
 * We don't expose Mongo directly; the bot reports it.
 */
export async function checkDatabase() {
  const url = import.meta.env.VITE_BOT_HEALTH_URL || 'https://ton618-bot.squareweb.app/health';
  const start = Date.now();
  try {
    const res = await fetchWithTimeout(url);
    const latency = Date.now() - start;
    if (!res.ok) return { status: 'unknown', latency, detail: 'Bot unreachable' };
    const json = await res.json().catch(() => ({}));
    // buildHealthPayload exposes mongoConnected at root level
    const mongoConnected = json.mongoConnected ?? json.checks?.database ?? json.database ?? json.mongo;
    if (mongoConnected === undefined || mongoConnected === null) {
      return { status: 'unknown', latency, detail: 'No DB info in health' };
    }
    const isUp = mongoConnected === true || mongoConnected === 'healthy' || mongoConnected === 'ok';
    return {
      status: isUp ? 'operational' : 'outage',
      latency,
      detail: isUp ? 'Connected' : 'Disconnected',
    };
  } catch (err) {
    return { status: 'unknown', latency: null, detail: 'See Discord Bot status' };
  }
}

/**
 * Check the main website (ton618bot.xyz).
 */
export async function checkWebsite() {
  const url = import.meta.env.VITE_WEBSITE_URL || 'https://ton618bot.xyz';
  const start = Date.now();
  try {
    const res = await fetchWithTimeout(url, { mode: 'no-cors' });
    const latency = Date.now() - start;
    // mode: no-cors always returns opaque response (type='opaque'), status=0
    // If fetch resolves without throwing, the server is reachable.
    return { status: 'operational', latency, detail: 'Reachable' };
  } catch (err) {
    return { status: 'outage', latency: null, detail: err.name === 'AbortError' ? 'Timeout' : 'Unreachable' };
  }
}

/**
 * Check Supabase REST health endpoint (public, no auth required).
 */
export async function checkSupabase() {
  const base = import.meta.env.VITE_SUPABASE_URL;
  if (!base) return { status: 'unknown', latency: null, detail: 'Not configured' };
  const url = `${base}/rest/v1/`;
  const start = Date.now();
  try {
    const res = await fetchWithTimeout(url, {
      headers: { 'apikey': 'public' },
    });
    const latency = Date.now() - start;
    // 200 or 400 (missing anon key) both mean Supabase is up
    const up = res.status < 500;
    return { status: up ? 'operational' : 'outage', latency, detail: `HTTP ${res.status}` };
  } catch (err) {
    return { status: 'outage', latency: null, detail: err.name === 'AbortError' ? 'Timeout' : 'Unreachable' };
  }
}

/**
 * Check Tebex checkout reachability.
 */
export async function checkTebex() {
  const url = import.meta.env.VITE_TEBEX_URL || 'https://checkout.tebex.io';
  const start = Date.now();
  try {
    await fetchWithTimeout(url, { mode: 'no-cors' });
    const latency = Date.now() - start;
    return { status: 'operational', latency, detail: 'Reachable' };
  } catch (err) {
    return { status: 'outage', latency: null, detail: err.name === 'AbortError' ? 'Timeout' : 'Unreachable' };
  }
}

/**
 * Run all checks in parallel and return the combined results.
 */
export async function runAllChecks() {
  const [bot, database, website, supabase, tebex] = await Promise.all([
    checkBot(),
    checkDatabase(),
    checkWebsite(),
    checkSupabase(),
    checkTebex(),
  ]);

  return { bot, database, website, supabase, tebex, checkedAt: new Date().toISOString() };
}
