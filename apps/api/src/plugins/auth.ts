import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import type { Role, OperatorId, UserId } from '@dnca/domain';
import type { Config } from '../config.js';

/**
 * Authenticated principal attached to every request that passes the auth
 * gate. Provider-agnostic: WorkOS supplies the identity in production
 * (ADR 0008); the dev/demo path uses a synthetic principal.
 */
export interface Principal {
  userId: UserId;
  email: string;
  fullName: string;
  operatorId: OperatorId | null;
  roles: ReadonlyArray<Role>;
  source: 'workos' | 'demo';
}

declare module 'fastify' {
  interface FastifyRequest {
    principal: Principal;
  }
}

interface AuthOptions {
  config: Config;
}

/**
 * Verifies the request bearer token, resolves to a Principal, and attaches
 * it to the request. Routes that need auth declare it via the
 * `{ config: { auth: 'required' } }` route option — see plugins/error.ts
 * for the typed route helper.
 *
 * Sprint 1: only the dev/demo path is wired. WorkOS JWT verification +
 * Organization → Operator lookup land in Sprint 2 once the API has at
 * least one DB-backed route to prove end-to-end auth flow.
 */
export const authPlugin: FastifyPluginAsync<AuthOptions> = async (app, opts) => {
  app.decorateRequest('principal', null as unknown as Principal);

  app.addHook('onRequest', async (request) => {
    if (opts.config.NODE_ENV === 'production') {
      // TODO(sprint-2): verify WorkOS JWT from Authorization header,
      // resolve Organization → operatorId, fetch RoleAssignment list.
      throw app.httpErrors.unauthorized('Production auth not yet wired');
    }
    request.principal = synthesizeDemoPrincipal(request);
  });
};

function synthesizeDemoPrincipal(request: FastifyRequest): Principal {
  // Demo path: every request is a platform-admin viewing the seeded JAK
  // operator. Used only when NODE_ENV !== 'production'.
  const operatorIdHeader = request.headers['x-demo-operator-id'];
  const operatorId =
    typeof operatorIdHeader === 'string' && /^[0-9a-f-]{36}$/i.test(operatorIdHeader)
      ? (operatorIdHeader as OperatorId)
      : ('11111111-1111-1111-1111-111111111111' as OperatorId);
  return {
    userId: '99999999-9999-9999-9999-000000000001' as UserId,
    email: 'demo@dnca.aero',
    fullName: 'Demo Platform Admin',
    operatorId,
    roles: ['PLATFORM_ADMIN'] as ReadonlyArray<Role>,
    source: 'demo',
  };
}

export default fp(authPlugin, { name: 'auth' });
