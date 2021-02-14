export const logRequests = async (ctx, next) => {
  console.log(ctx.request.method, ctx.request.path)
  await next()
}

export default {
  logRequests
}
