import amqp from 'amqplib'

export class QueueClient {
  constructor({
    host,
    connection
  }) {
    this.host = host
    this.connection = connection
    this.channels = new Map()
  }

  static async init(host) {
    const connection = await amqp.connect(this.host)
    return new QueueClient({
      host,
      connection
    })
  }

  // one channel per queue?
  async getChannel(name) {
    if (this.channels.has(name)) {
      return this.channels.get(name)
    }
    const chan = await this.connection.createChannel()
    this.channels.set(name, chan)
    return chan
  }

  async subscribe(queue, handler) {
    const chan = await this.getChannel(queue)
    return chan.assertQueue(queue).then(() => {
      chan.consume(queue, handler)
      return chan
    })
  }

  async publish(queue, message) {
    let chan = await this.getChannel(queue)
    if (!Buffer.isBuffer(message)) {
      message = Buffer.from(message)
    }
    return chan.sendToQueue(queue, message)
  }

  async close() {
    const ps = []
    this.channels.forEach(ch => {
      ps.push(ch.close())
    })
    await Promise.all(ps)
    await this.connection.close()
  }
}