import type { FastifyPluginAsync } from 'fastify';
import { pilots } from '@dnca/db';
import { eq } from 'drizzle-orm';

/**
 * GET /pilots — proof of end-to-end RLS-scoped DB read.
 *
 * Touches: auth (resolves operatorId from principal) → tenant
 * (SET LOCAL app.operator_id) → @dnca/db select. RLS at the database
 * boundary ensures cross-operator leakage is impossible even if a
 * future bug forgets a WHERE clause.
 *
 * Sprint 2: response schema via fastify-type-provider-zod once that's
 * properly wired into setValidatorCompiler / setSerializerCompiler.
 * For now the TypeScript return type is checked at the source.
 */
export const pilotRoutes: FastifyPluginAsync = async (app) => {
  app.get('/pilots', async (request) => {
    const operatorId = request.principal.operatorId;
    if (!operatorId) {
      throw app.httpErrors.forbidden('No operator scope for this principal');
    }

    const rows = await app.withOperatorScope(operatorId, async (db) =>
      db.select().from(pilots).where(eq(pilots.active, true)),
    );

    return {
      pilots: rows.map((p) => ({
        id: p.id,
        fullName: p.fullName,
        licenceNumber: p.licenceNumber,
        role: p.role,
        baseIcao: p.baseIcao,
        phase: p.phase,
        active: p.active,
      })),
      asOf: new Date().toISOString(),
    };
  });
};
