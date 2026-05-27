/**
 * Web → API wiring configuration.
 *
 * When `API_BASE_URL` is set, server-component fetches go to the real
 * @dnca/api Fastify backend with operator scope set via `x-demo-operator-id`
 * (dev path) until WorkOS JWT verification flips on in Sprint 3.
 *
 * When `API_BASE_URL` is unset (CI build, local web-only dev, Vercel preview
 * with no API yet), pages fall back to deterministic @dnca/domain fixtures so
 * the UI remains demoable end-to-end — the type-extensibility and CBTA stories
 * don't need a live DB to be credible.
 */

export interface ApiConfig {
  readonly baseUrl: string;
  readonly demoOperatorId: string;
}

export function getApiConfig(): ApiConfig | null {
  const baseUrl = process.env['API_BASE_URL']?.replace(/\/+$/, '');
  const demoOperatorId = process.env['DEMO_OPERATOR_ID'];
  if (!baseUrl) return null;
  if (!demoOperatorId) return null;
  return { baseUrl, demoOperatorId };
}

export function isApiConfigured(): boolean {
  return getApiConfig() !== null;
}
