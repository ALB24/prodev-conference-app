import bodyParser from 'koa-body'
import cors from '@koa/cors'
import dotenv from 'dotenv'
import Koa from 'koa'
import niv from 'node-input-validator'
import { router } from './router.mjs'
import { security, logging, serviceClients } from 'conference-app-lib';

import { handleNewEventListener } from "./handlers.mjs";

const queueClient = new serviceClients.QueueClient('amqp://rabbitmq');

dotenv.config();

if (!queueClient.connection) {
  setTimeout(async () => {
    const chan = await queueClient.subscribe('events', async (message) => {
      await handleNewEventListener(message)
      chan.ack(message)
    })
  }, 1000)
} else {
  queueClient.subscribe('events', handleNewEventListener)
  const chan = await queueClient.subscribe('events', async (message) => {
    await handleNewEventListener(message)
    chan.ack(message)
  })
}

const port = Number.parseInt(process.env['PORT']);
if (Number.isNaN(port)) {
  console.error('ERROR: Missing PORT environment variable.');
  process.exit(1);
}

const app = new Koa();
app.use(cors({
  allowHeaders: ['Authorization', 'Content-Type']
}));

app.use(niv.koa());
app.use(security.bearer);
app.use(security.authorize);

app.use(logging.logRequests)

app.use(bodyParser());

app.use(router.routes());

app.listen(port);