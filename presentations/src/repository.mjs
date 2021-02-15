import {
  pool
} from 'conference-app-lib'

const STATUSES = new Map();
STATUSES.set(1, 'SUBMITTED');
STATUSES.set(2, 'APPROVED');
STATUSES.set(3, 'REJECTED');

export async function createEvent(event_id, account_id) {
  const {
    rows
  } = await pool.query(`
    INSERT INTO events_accounts (account_id, event_id)
    VALUES ($1, $2)
    ON CONFLICT (event_id)
    DO NOTHING
    RETURNING account_id, event_id
  `, [account_id, event_id])

  return rows[0]
}

export async function deleteEvent(event_id) {
  const {
    rows
  } = await pool.query(`
    DELETE FROM events_accounts
    WHERE event_id = $1
  `, [event_id])

  return rows[0]
}

export async function getPresentationsForEvent(eventId) {
  const {
    rows
  } = await pool.query(`
    SELECT id, email, presenter_name, company_name, title, synopsis, status_id
    FROM presentations p
    WHERE event_id = $1
  `, [eventId])

  return rows.map(p => ({
    ...p,
    status: STATUSES.get(p.statusId),
  }))
}

export async function createPresentation(eventId, presentationInfo) {
  const {
    email,
    presenterName,
    companyName,
    title,
    synopsis
  } = presentationInfo

  const {
    rows
  } = await pool.query(`
    INSERT INTO presentations (email, presenter_name, company_name, title, synopsis, event_id)
    SELECT $1, $2, $3, $4, $5, $6
    RETURNING id, status_id AS "statusId"
  `, [email, presenterName, companyName, title, synopsis, eventId]);

  if (!rows.length) {
    return null
  }
  const {
    id,
    statusId
  } = rows[0]
  return {
    id,
    email,
    presenterName,
    companyName,
    title,
    synopsis,
    eventId,
    status: STATUSES.get(statusId),
  }
}

export async function approvePresentation(eventId, presentationId) {
  const {
    rows
  } = await pool.query(`
    UPDATE presentations
    SET status_id = 2
    WHERE id = $1
    and status_id in (1, 2)
    and event_id = $2
    returning email, presenter_name as "presenterName", company_name as "companyName", title, synopsis
  `, [presentationId, eventId])
  const presentation = rows[0]
  if (!presentation) {
    return null
  }
  return {
    id: presentationId,
    ...presentation,
    status: STATUSES.get(2)
  }
}

export async function rejectPresentation(eventId, presentationId) {
  const {
    rows
  } = await pool.query(`
    UPDATE presentations
    SET status_id = 3
    WHERE id = $1
    AND status_id IN (1, 2)
    AND event_id = $2
    RETURNING email, presenter_name AS "presenterName", company_name AS "companyName", title, synopsis
  `, [presentationId, eventId])
  const presentation = rows[0]
  if (!presentation) {
    return null
  }
  return {
    id: presentationId,
    ...presentation,
    status: STATUSES.get(3)
  }
}