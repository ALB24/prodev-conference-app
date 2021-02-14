import { trimProperty } from 'conference-app-lib'

export const validateEventId = async function (ctx, next) {
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
  await next()
}

export const validateBadgeBody = role => async (ctx, next) => {
  trimProperty(ctx.request.body, 'name');
  trimProperty(ctx.request.body, 'email');
  trimProperty(ctx.request.body, 'companyName');

  const validatorQuery = {
    name: 'required|minLength:1|maxLength:100',
    email: 'required|email|maxLength:100',
    companyName: 'required|minLength:1|maxLength:100',
  }

  if (role === 'presenter') {
  trimProperty(ctx.request.body, 'presentationId')
    validatorQuery.presentationId = 'required|integer'
  }

  let v = await ctx.validator(ctx.request.body, validatorQuery);

  let fails = await v.fails();
  if (fails) {
    ctx.status = 400;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not create a badge because at least one of the values is bad.',
      errors: v.errors,
    };
  }
  await next()
}