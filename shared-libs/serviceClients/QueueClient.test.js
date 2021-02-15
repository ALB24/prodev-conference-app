import {
  QueueClient
} from './QueueClient.mjs'
// const amqp = require('amqplib')

const sleep = t => new Promise(res => setTimeout(res, t))
let rabbit

beforeEach(async () => {
  rabbit = new QueueClient('amqp://localhost')
})

afterEach(async () => {
  if (rabbit.connection) {
    await rabbit.close()
  }
})

test('instantiates', () => {
  ['host', 'pendingConnection', 'connection', 'publish', 'subscribe', 'getChannel'].forEach(func => {
    expect(rabbit).toHaveProperty(func);
  })
})

test('create channel if does not exist', async () => {
  await rabbit.pendingConnection
  const chan = await rabbit.getChannel('test1')
  expect(rabbit.channels.has('test1')).toBe(true)
  expect(rabbit.channels.get('test1')).toBe(chan)
})

test('subscribe return channel', async () => {
  await rabbit.pendingConnection
  const chan = await rabbit.subscribe('test1', (data) => {})
  expect(rabbit.channels.has('test1')).toBe(true)
  expect(rabbit.channels.get('test1')).toBe(chan)
})

test('add publisher and consumer, send messages, consumer receives', async () => {
  await rabbit.pendingConnection
  const p = await rabbit.getChannel('test1')
  let messages = []

  const chan = await rabbit.subscribe('test1', m => {
    messages.push(m.content)
    chan.ack(m)
  })

  await rabbit.publish('test1', 'asdf')
  await rabbit.publish('test1', 'sdfg')
  await rabbit.publish('test1', 'dfgh')
  await sleep(1000)
  expect(messages.length).toBe(3)
  expect(messages.map(m => m.toString())).toEqual(['asdf', 'sdfg', 'dfgh'])
})