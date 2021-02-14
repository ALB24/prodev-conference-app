import { authorize } from '../security.mjs';
import { pool } from '../db/index.mjs';
import { trimProperty } from '../strings.mjs';
import qrcode from 'qrcode';
import Router from '@koa/router';

export const router = new Router({
  prefix: '/events/:eventId'
});

router.use(authorize);

// get badges for event
router.get('/', async ctx => {
  console.log('GET badges')
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
    SELECT id, email, name, company_name, role
    FROM badges
    WHERE event_id = $1
  `, [eventId])
  
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
router.get('/attendees', async ctx => {
  console.log('GET attendees')
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
    SELECT id, email, name, company_name, role
    FROM badges
    WHERE event_id = $1
    AND role = 'attendee'
  `, [eventId])
  
  ctx.body = rows.map(x => ({
    name: x.name,
    email: x.email,
  }));
});

// add attendee to event
router.post('/attendees', async ctx => {
  console.log('POST /attendees')
  // REQUEST VALIDATION
  trimProperty(ctx.request.body, 'name');
  trimProperty(ctx.request.body, 'email');
  trimProperty(ctx.request.body, 'companyName');
  trimProperty(ctx.request.body, 'presentationId')

  let v = await ctx.validator(ctx.request.body, {
    name: 'required|minLength:1|maxLength:100',
    email: 'required|email|maxLength:100',
    companyName: 'required|minLength:1|maxLength:100',
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

  // insert badge
  const { email, name, companyName } = ctx.request.body;
  const badgeInfo = {
    email,
    name,
    companyName,
    eventId,
    role: 'attendee'
  }

  const badge = await upsertBadge(badgeInfo)
  if (badge) {
    ctx.status = 201;
    ctx.body = {
      id: badge.id,
      email,
      name,
      companyName,
      created: badge.created,
    };
  } else {
    ctx.status = 400
    ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find an event with that id to add an attendee to'
    }
  }
});

// register a presenter for an event
router.post('/presenters', async ctx => {
  console.log('POST /presenters')
  // REQUEST VALIDATION
  trimProperty(ctx.request.body, 'name');
  trimProperty(ctx.request.body, 'email');
  trimProperty(ctx.request.body, 'companyName');
  trimProperty(ctx.request.body, 'presentationId')

  let v = await ctx.validator(ctx.request.body, {
    name: 'required|minLength:1|maxLength:100',
    email: 'required|email|maxLength:100',
    companyName: 'required|minLength:1|maxLength:100',
    presentationId: 'required|minLength:1|maxLength:100',
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

  // insert badge
  const { email, name, companyName } = ctx.request.body;
  const badgeInfo = {
    email,
    name,
    companyName,
    eventId
  }

  console.log(badgeInfo)
  const badge = await upsertBadge(badgeInfo)
  if (badge) {
    ctx.status = 201;
    ctx.body = {
      id: badge.id,
      email,
      name,
      companyName,
      created: badge.created,
    };
  } else {
    ctx.status = 400
    ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find an event with that id to add an attendee to'
    }
  }
});

async function upsertBadge({ name, email, companyName, eventId, role = 'presenter'}) {
  const { rows } = await pool.query(`
    INSERT INTO badges (name, email, company_name, event_id, role)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (email)
    DO 
      UPDATE SET role='presenter'
    RETURNING id, created
  `, [name, email, companyName, eventId, role])
  return rows[0];
}


