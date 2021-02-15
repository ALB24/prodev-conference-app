import {
  createEvent,
  deleteEvent,
  getBadgesForEvent,
  getAttendeesForEvent,
  upsertBadge
} from './repository.mjs'

import {
  extractBadgeInfo
} from './helpers.mjs'

export const handleNewEventMessage = async (message) => {
  const eventMessage = JSON.parse(message.content.toString())
  console.log('WE GOT A MESSAGE IN PRESENTATIONS:', eventMessage)
  const {
    account_id,
    event_id,
    status
  } = eventMessage

  switch (status) {
    case 'created:event':
      await createEvent(event_id, account_id);
      break;
    case 'deleted:event':
      await deleteEvent(event_id);
      break;
    default:
      throw new Error('Invalid message status')
  }
}

export const handleGetBadges = async (ctx) => {
  console.log('GET badges handler')
  const {
    eventId
  } = ctx.params;
  const badges = await getBadgesForEvent(eventId)
  ctx.body = badges
}

export const handleGetAttendees = async (ctx) => {
  console.log('GET attendees handler')
  const {
    eventId
  } = ctx.params;
  const attendees = await getAttendeesForEvent(eventId)
  ctx.body = attendees
}

export const handleBadgeCreation = role => async (ctx) => {
  const badgeInfo = extractBadgeInfo(ctx, role)
  const badgeResult = await upsertBadge(badgeInfo)

  if (badgeResult) {
    ctx.status = 201;
    ctx.body = {
      id: badgeResult.id,
      email: badgeInfo.email,
      name: badgeInfo.name,
      companyName: badgeInfo.companyName,
      created: badgeResult.created,
    };
  } else {
    ctx.status = 500
    ctx.body = {
      code: 'SERVER_ERROR',
      message: 'Unexpected save error'
    }
  }
}