export function extractBadgeInfo(ctx, role) {
  const { email, name, companyName } = ctx.request.body;
  return {
    email,
    name,
    companyName,
    eventId: ctx.params.eventId,
    role
  }
}