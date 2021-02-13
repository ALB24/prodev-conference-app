import Router from '@koa/router';
import { router as sessionRouter } from './session.mjs';
import { router as accountRouter } from './accounts.mjs';

export const router = new Router();

router.use('/api', sessionRouter.routes(), sessionRouter.allowedMethods());
router.use('/api', accountRouter.routes(), accountRouter.allowedMethods());
