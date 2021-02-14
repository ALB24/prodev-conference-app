import Router from '@koa/router';

import { 
  validators
 } from 'conference-app-lib'
import { 
  handleGetPresentations,
  handleCreatePresentation,
  handleApprovePresentation,
  handleRejectPresentation
 } from './handlers.mjs';

import { authorizeEvent } from './security.mjs'
import { validatePresentation } from './validators.mjs'

export const router = new Router({
  prefix: '/events/:eventId'
});

router.use(validators.validateEventId)
router.use(authorizeEvent)

router.get('/', handleGetPresentations);

router.post('/', validatePresentation, handleCreatePresentation)

router.put('/presentations/:id/approved', handleApprovePresentation)

router.put('/presentations/:id/rejected', handleRejectPresentation)
