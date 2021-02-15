import bodyParser from 'koa-body'
import cors from '@koa/cors'
import dotenv from 'dotenv'
import Koa from 'koa'
import niv from 'node-input-validator'
import {
  router
} from './router.mjs'
import amqp from 'amqplib'
import {
  security,
  logging,
} from 'conference-app-lib';

import {
  handleNewEventMessage
} from "./handlers.mjs";

dotenv.config();

// const queueClient = new serviceClients.QueueClient(process.env.AMQP_HOST);
// queueClient.pendingConnection.then(async () => {
//   const chan = await queueClient.subscribe('events', async (message) => {
//     console.log('Badges Message')
//     // TODO: something smart with errors
//     await handleNewEventMessage(message).then(res => chan.ack(message)).catch(console.error)
//   })
// })

amqp.connect(process.env.AMQP_HOST).then(conn => {
  conn.createChannel().then(chan => {
    chan.assertQueue('events:badges').then(() => {
      chan.consume('events:badges', (message) => {
        console.log('Badges Message')
        // TODO: something smart with errors
        handleNewEventMessage(message).then(res => chan.ack(message)).catch(console.error)
      })
    })
  })
})

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