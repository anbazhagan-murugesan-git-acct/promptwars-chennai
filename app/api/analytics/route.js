import { getTeamAnalytics } from '../../../lib/gcp';

/**
 * API Route: GET /api/analytics
 * 
 * Retrieves team activity analytics from Google BigQuery.
 * Powers the team coordination dashboard for workflow visibility.
 * 
 * @param {Request} request - Incoming HTTP request with query params
 * @returns {Response} JSON response with analytics data
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId') || 'default-team';
    const days = parseInt(searchParams.get('days') || '7', 10);

    // Input validation
    if (days < 1 || days > 90) {
      return new Response(
        JSON.stringify({ error: 'Days parameter must be between 1 and 90' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const analytics = await getTeamAnalytics(teamId, days);

    return new Response(
      JSON.stringify({ teamId, period: `${days} days`, data: analytics }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Analytics API] Error:', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve analytics' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
