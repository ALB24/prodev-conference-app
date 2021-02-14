import Router from '@koa/router';
import { validateEventId, validateBadgeBody } from './validators.mjs'
import { handleBadgeCreation, handleGetAttendees, handleGetBadges } from './handlers.mjs' 
import { authorizeEvent } from './security.mjs';

export const router = new Router({
  prefix: '/events/:eventId'
});

router.use(authorizeEvent);
router.use(validateEventId)

router.get('/', handleGetBadges);
router.get('/attendees', handleGetAttendees)
router.post('/attendees', validateBadgeBody('attendee'), handleBadgeCreation('attendee'))
router.post('/presenters', validateBadgeBody('presenter'), handleBadgeCreation('presenter'))
