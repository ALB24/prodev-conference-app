import { authorize, identify } from '../security.mjs';
import { pool } from '../db/index.mjs';
import qrcode from 'qrcode';
import Router from '@koa/router';

export const router = new Router();

router.use(authorize);
router.use(identify);

// get badges for event
router.get('/events/:eventId', async ctx => {
  const { eventId } = ctx.params;
  let v = await ctx.validator(ctx.params, {
    eventId: 'required|integer',
  });
  let fails = await v.fails();
  if (fails) {
    ctx.status = 400;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find that event.',
      errors: v.errors,
    };
  }

  const { rows } = await pool.query(`
    SELECT beid, b.email, b.name, b.company_name AS "companyName", b.role
    FROM badges b
    JOIN events_accounts ea ON (b.event_id = ea.event_id AND ea.account_id = a.id)
    WHERE a.id = $1
    AND e.id = $2
  `, [ctx.claims.id, eventId])
  
  ctx.body = rows.map(x => ({
    name: x.name,
    companyName: x.companyName,
    role: x.role,
  }));
  for (let item of ctx.body) {
    item.qrcode = await qrcode.toString(`${item.id}|${item.name}`);
  }
});

// get attendees for event
router.get('/events/:eventId/attendees', async ctx => {
  const { eventId } = ctx.params;
  let v = await ctx.validator(ctx.params, {
    eventId: 'required|integer',
  });
  let fails = await v.fails();
  if (fails) {
    ctx.status = 400;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find that event.',
      errors: v.errors,
    };
  }

  const { rows } = await pool.query(`
    SELECT beid, b.email, b.name, b.company_name AS "companyName", b.role
    FROM badges b
    JOIN events_accounts ea ON (b.event_id = ea.event_id AND ea.account_id = a.id)
    WHERE a.id = $1
    AND e.id = $2
    AND b.role = "attendee"
  `, [ctx.claims.id, eventId])
  
  ctx.body = rows.map(x => ({
    name: x.name,
    companyName: x.companyName,
    role: x.role,
  }));
  for (let item of ctx.body) {
    item.qrcode = await qrcode.toString(`${item.id}|${item.name}`);
  }
});

// create a badge for an event
router.post('/events/:eventId', async ctx => {
  trimProperty(ctx.request.body, 'name');
  trimProperty(ctx.request.body, 'email');
  trimProperty(ctx.request.body, 'companyName');
  trimProperty(ctx.request.body, 'role');

  let v = await ctx.validator(ctx.request.body, {
    name: 'required|minLength:1|maxLength:100',
    email: 'required|email|maxLength:100',
    companyName: 'required|minLength:1|maxLength:100',
    role: 'required|minLength:1|maxLength:100',
  });
  let fails = await v.fails();
  if (fails) {
    ctx.status = 400;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not create a proposal because at least one of the values is bad.',
      errors: v.errors,
    };
  }

  const { eventId } = ctx.params;
  v = await ctx.validator(ctx.params, {
    eventId: 'required|integer',
  });
  fails = await v.fails();
  if (fails) {
    ctx.status = 400;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not create a proposal because at least one of the values is bad.',
      errors: v.errors,
    };
  }

  const accountId = ctx.claims.id;

  const { email, name, companyName } = ctx.request.body;
  const { rows: attendeesRows } = await pool.query(`
    INSERT INTO badges (name, email, company_name, event_id)
    SELECT $1, $2, $3, e.id
    FROM events e
    JOIN accounts a ON (e.account_id = a.id) 
    WHERE e.id = $4
    AND a.id = $5
    RETURNING id, created
  `, [email, name, companyName, eventId, accountId]);

  if (attendeesRows.length === 0) {
    ctx.status = 404;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find an event with that id to add an attendee to'
    };
  }

  await pool.query(`
    INSERT INTO badges (email, name, company_name, role, event_id)
    VALUES ($1, $2, $3, '', $4)
    ON CONFLICT (email, event_id)
    DO NOTHING
  `, [email, name, companyName, eventId]);

  const { id, created } = attendeesRows[0];
  ctx.status = 201;
  ctx.body = {
    id,
    email,
    name,
    companyName,
    created,
  };
});