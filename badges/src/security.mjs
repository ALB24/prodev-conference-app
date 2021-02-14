import { pool } from 'conference-app-lib';

export async function authorizeEvent (ctx, next) {
  const { rows } = await pool.query(`
    SELECT account_id, event_id FROM events_accounts
    WHERE account_id = ${ ctx.claims.id }
    AND event_id = ${ ctx.params.eventId }
  `);

  if (rows.length === 0) {
    ctx.status = 404;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find an event with that id to add an attendee to'
    };
  }
  await next();
}