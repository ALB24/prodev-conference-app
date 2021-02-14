import bodyParser from 'koa-body'
import cors from '@koa/cors'
import dotenv from 'dotenv'
import Koa from 'koa'
import niv from 'node-input-validator'
import { security, logging } from 'conference-app-lib'
import { router } from './router.mjs'
dotenv.config()

const port = Number.parseInt(process.env['PORT'])
if (Number.isNaN(port)) {
  console.error('ERROR: Missing PORT environment variable.')
  process.exit(1)
}

const app = new Koa()
app.use(cors({
  allowHeaders: ['Authorization', 'Content-Type']
}))
app.use(niv.koa())
app.use(bodyParser())

app.use(logging.logRequests)
app.use(security.bearer)
app.use(security.authorize)

app.use(router.routes())

app.listen(port)