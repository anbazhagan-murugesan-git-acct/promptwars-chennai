import { pushAuditLog } from '../../../lib/gcp';

/**
 * API Route: POST /api/audit
 * 
 * Pushes structured audit log entries to Google BigQuery.
 * Supports enterprise compliance and team activity tracking workflows.
 * 
 * @param {Request} request - Incoming HTTP request
 * @returns {Response} JSON response with audit log status
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.action) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: action' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate action type against allowed values
    const allowedActions = ['TASK_CREATED', 'TASK_MOVED', 'TASK_DELETED', 'AI_PROMPT', 'USER_LOGIN'];
    if (!allowedActions.includes(body.action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await pushAuditLog(body.action, {
      userId: body.userId || 'anonymous',
      taskId: body.taskId || null,
      details: body.details || {}
    });

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Audit API] Error:', error.message);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
