import {
  pool
} from '../db/index.mjs';
import {
  trimProperty
} from '../strings.mjs';
import Router from '@koa/router';
import {authorize} from '../security.mjs'

const STATUSES = new Map();
STATUSES.set(1, 'SUBMITTED');
STATUSES.set(2, 'APPROVED');
STATUSES.set(3, 'REJECTED');

export const router = new Router({
  prefix: '/events/:eventId'
});

router.use(authorize)

router.get('/', async ctx => {
  const {
    eventId
  } = ctx.params;
  let v = await ctx.validator(ctx.params, {
    eventId: 'required|integer',
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

  const {
    rows
  } = await pool.query(`
    SELECT id, email, presenter_name, company_name, title, synopsis, status_id
    FROM presentations p
    WHERE event_id = $1
  `, [eventId])

  console.log("ROWS", rows)

  ctx.body = rows.map(p => ({
    ...p,
    status: STATUSES.get(p.statusId),
  }));
});

router.post('/', async ctx => {
  console.log('POST handler, event', ctx.params.eventId)

  // REQUEST VALIDATION
  trimProperty(ctx.request.body, 'email');
  trimProperty(ctx.request.body, 'presenterName');
  trimProperty(ctx.request.body, 'companyName');
  trimProperty(ctx.request.body, 'title');
  trimProperty(ctx.request.body, 'synopsis');
  let v = await ctx.validator(ctx.request.body, {
    presenterName: 'required|minLength:1|maxLength:100',
    email: 'required|email|maxLength:100',
    companyName: 'required|minLength:1|maxLength:100',
    title: 'required|minLength:8|maxLength:100',
    synopsis: 'required|minLength:50',
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

  const {
    eventId
  } = ctx.params;
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

  // INSERT PRESENTATION
  const {
    email,
    presenterName,
    companyName,
    title,
    synopsis
  } = ctx.request.body;
  const {
    rows: presentationRows
  } = await pool.query(`
    INSERT INTO presentations (email, presenter_name, company_name, title, synopsis, event_id)
    SELECT $1, $2, $3, $4, $5, $6
    RETURNING id, status_id AS "statusId"
  `, [email, presenterName, companyName, title, synopsis, eventId]);

  if (presentationRows.length === 0) {
    ctx.status = 404;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find an event with that id to add an attendee to'
    };
  }

  const {
    id,
    statusId
  } = presentationRows[0];
  ctx.status = 201;
  ctx.body = {
    id,
    email,
    presenterName,
    companyName,
    title,
    synopsis,
    status: STATUSES.get(statusId),
  };
});

router.put('/presentations/:id/approved', async ctx => {
  console.log('approved')
  const {
    eventId
  } = ctx.params;
  let v = await ctx.validator(ctx.params, {
    eventId: 'required|integer',
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

  const {
    id: presentationId
  } = ctx.params;

  const {
    rows
  } = await pool.query(`
    UPDATE presentations
    SET status_id = 2
    WHERE id = $1
    AND status_id IN (1, 2)
    AND event_id = $2
    RETURNING email, presenter_name AS "presenterName", company_name AS "companyName", title, synopsis
  `, [presentationId, eventId]);
  if (rows.length === 0) {
    ctx.status = 404;
    return ctx.body = {
      code: 'INVALID_IDENTIFIER',
      message: 'Could not approve that presentation.'
    };
  }

  const {
    email,
    presenterName,
    companyName,
    title,
    synopsis
  } = rows[0];

  // TODO: Send the presenter to the badges service
  // await pool.query(`
  //   INSERT INTO badges (email, name, company_name, role, event_id)
  //   VALUES ($1, $2, $3, 'SPEAKER', $4)
  //   ON CONFLICT (email, event_id)
  //   DO
  //   UPDATE SET role = 'SPEAKER'
  // `, [email, presenterName, companyName, eventId]);

  ctx.body = {
    id: presentationId,
    email,
    presenterName,
    companyName,
    title,
    synopsis,
    status: STATUSES.get(2)
  };
});




router.put('/presentations/:id/rejected', async ctx => {
  console.log('rejected')
  const {
    id
  } = ctx.params;

  const {
    rows
  } = await pool.query(`
    UPDATE presentations
    SET status_id = 3
    WHERE id = $1
    AND status_id IN (1, 2)
    AND event_id = $2
    RETURNING email, presenter_name AS "presenterName", company_name AS "companyName", title, synopsis
  `, [id, ctx.claims.id]);
  if (rows.length === 0) {
    ctx.status = 404;
    return ctx.body = {
      code: 'INVALID_IDENTIFIER',
      message: 'Could not reject that presentation.'
    };
  }

  const {
    email,
    presenterName,
    companyName,
    title,
    synopsis
  } = rows[0];
  ctx.body = {
    id,
    email,
    presenterName,
    companyName,
    title,
    synopsis,
    status: STATUSES.get(3)
  };
});