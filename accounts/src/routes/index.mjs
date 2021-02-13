import Router from '@koa/router';
import { router as sessionRouter } from './session.mjs';
import { router as accountRouter } from './accounts.mjs';

export const router = new Router();

router.use('/', sessionRouter.routes(), sessionRouter.allowedMethods());
router.use('/', accountRouter.routes(), accountRouter.allowedMethods());
