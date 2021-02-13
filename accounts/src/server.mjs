import bodyParser from 'koa-body';
import cors from '@koa/cors';
import dotenv from 'dotenv';
import Koa from 'koa';
import niv from 'node-input-validator';
import { router } from './routes/index.mjs';
import { bearer } from './security.mjs';

dotenv.config();

const port = Number.parseInt(process.env['PORT']);
if (Number.isNaN(port)) {
  console.error('ERROR: Missing PORT environment variable.');
  process.exit(1);
}

const app = new Koa();
app.use(cors({
  allowHeaders: ['Authorization', 'Content-Type']
}));

// app.use(ctx => {
//   console.log('gotrequest')
//   console.log(ctx.request.path)
//   return ctx
// })


app.use(niv.koa());
app.use(bearer);

app.use(bodyParser());

app.use(router.routes());

app.listen(port);
