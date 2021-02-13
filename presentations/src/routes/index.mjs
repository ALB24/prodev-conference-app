import Router from '@koa/router';
import { router as presentationsRouter } from './presentations.mjs';

export const router = new Router();

router.use('/api', presentationsRouter.routes(), presentationsRouter.allowedMethods());

