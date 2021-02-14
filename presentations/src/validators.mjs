import { trimProperty } from 'conference-app-lib'

export const validatePresentation = async (ctx, next) => {
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
  await next()
}
