import {
  pool
} from 'conference-app-lib'
import qrcode from 'qrcode'

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

export async function upsertBadge({
  name,
  email,
  companyName,
  eventId,
  role = 'presenter'
}) {
  const {
    rows
  } = await pool.query(`
    INSERT INTO badges (name, email, company_name, event_id, role)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (email)
    DO 
      UPDATE SET role='presenter'
    RETURNING id, created
  `, [name, email, companyName, eventId, role])

  return rows[0]
}

export async function getAttendeesForEvent(eventId) {
  const {
    rows
  } = await pool.query(`
    SELECT id, email, name, company_name, role
    FROM badges
    WHERE event_id = $1
    AND role = 'attendee'
  `, [eventId])

  return rows.map(x => ({
    name: x.name,
    email: x.email,
    companyName: x.company_name
  }))
}

export async function getBadgesForEvent(eventId) {
  const {
    rows
  } = await pool.query(`
    SELECT id, email, name, company_name, role
    FROM badges
    WHERE event_id = $1
  `, [eventId])

  const badges = rows.map(x => ({
    name: x.name,
    companyName: x.companyName,
    role: x.role,
  }))

  for (const badge of badges) {
    badge.qrcode = await qrcode.toString(`${badge.id}|${badge.name}`)
  }
  return badges
}