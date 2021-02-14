import Router from '@koa/router';
import { validateBadgeBody } from './validators.mjs'
import { validators } from 'conference-app-lib'
import { handleBadgeCreation, handleGetAttendees, handleGetBadges } from './handlers.mjs' 
import { authorizeEvent } from './security.mjs';

export const router = new Router({
  prefix: '/events/:eventId'
});

router.use(validators.validateEventId)
router.use(authorizeEvent);

router.get('/', handleGetBadges);
router.get('/attendees', handleGetAttendees)
router.post('/attendees', validateBadgeBody('attendee'), handleBadgeCreation('attendee'))
router.post('/presenters', validateBadgeBody('presenter'), handleBadgeCreation('presenter'))
