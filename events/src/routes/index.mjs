import Router from '@koa/router';
import {
  router as eventsRouter
} from './events.mjs';
import {
  router as locationsRouter
} from './locations.mjs';

export const router = new Router();

router.use('/', eventsRouter.routes(), eventsRouter.allowedMethods());
router.use('/locations', locationsRouter.routes(), locationsRouter.allowedMethods());