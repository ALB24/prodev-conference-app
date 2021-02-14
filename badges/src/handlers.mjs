import { 
  createEventAndAccount,
  getBadgesForEvent, 
  getAttendeesForEvent, 
  upsertBadge } from './repository.mjs'

import { extractBadgeInfo } from './helpers.mjs'

export const handleNewEventListener = async (message) => {
  console.log('WE GOT A MESSAGE IN BADGES if', message.content.toString())
  const eventMessage = JSON.parse(message.content.toString())
  
  if (eventMessage.status === 'created:event') {
    const { account_id, event_id } = eventMessage;
    await createEventAndAccount(account_id, event_id)
  }
}

export const handleGetBadges = async (ctx) => {
  console.log('GET badges handler')
  const { eventId } = ctx.params;
  const badges = await getBadgesForEvent(eventId)
  ctx.body = badges
}

export const handleGetAttendees = async (ctx) => {
  console.log('GET attendees handler')
  const { eventId } = ctx.params;
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
