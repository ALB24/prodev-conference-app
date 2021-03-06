import amqp from 'amqplib'

export class QueueClient {
  constructor(host, exchange) {
    this.host = host
    this.connection = null
    this.pendingConnection = amqp.connect(this.host).then(c => {
      this.connection = c
    })
    this.channels = new Map()
  }

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
    return chan.assertQueue(queue, {
      exclusive: false
    }).then(() => {
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
    return this.connection.close()
  }
}