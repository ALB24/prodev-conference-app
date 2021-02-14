import bodyParser from 'koa-body';
import cors from '@koa/cors';
import dotenv from 'dotenv';
import Koa from 'koa';
import niv from 'node-input-validator';
dotenv.config();
import {
  router
} from './routes/index.mjs';

import {
  security
} from 'conference-app-lib';

const port = Number.parseInt(process.env['PORT']);
if (Number.isNaN(port)) {
  console.error('ERROR: Missing PORT environment variable.');
  process.exit(1);
}

const app = new Koa();
app.use(cors({
  allowHeaders: ['Authorization', 'Content-Type']
}));

app.use(async (ctx, next) => {
  console.log(ctx.request.method, ctx.request.path)
  await next()
})

app.use(niv.koa())

app.use(security.bearer)
app.use(security.authorize)

app.use(bodyParser());

app.use(router.routes());

app.listen(port);