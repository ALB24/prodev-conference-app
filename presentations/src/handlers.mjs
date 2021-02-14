import { serviceClients } from 'conference-app-lib'
import {
  getPresentationsForEvent,
  createPresentation,
  approvePresentation,
  rejectPresentation
} from './repository.mjs'
const badgeService = new serviceClients.BadgesREST(process.env.BADGE_SVC_HOST)

export async function handleGetPresentations(ctx) {
  const { eventId } = ctx.params
  ctx.body = await getPresentationsForEvent(eventId)
}

export async function handleCreatePresentation(ctx) {
  const { eventId } = ctx.params
  const presentationInfo = ctx.request.body
  const presentation = await createPresentation(eventId, presentationInfo)

  if (!presentation) {
    ctx.status = 404;
    return ctx.body = {
      code: 'INVALID_PARAMETER',
      message: 'Could not find an event with that id to add an attendee to'
    };
  }

  ctx.status = 201
  ctx.body = presentation
}

export async function handleApprovePresentation (ctx) {
  const { id: presentationId, eventId } = ctx.params;

  const presentation = await approvePresentation(eventId, presentationId)

  if (!presentation) {
    ctx.status = 404;
    return ctx.body = {
      code: 'INVALID_IDENTIFIER',
      message: 'Could not approve that presentation.'
    };
  }

  const {
    presenterName: name,
    email,
    companyName,
  } = presentation

  const presenter = {
    name,
    email,
    companyName,
    presentationId
  }




  // TODO: handle errors
  const badgeResponse = await badgeService.sendPresenter(eventId, presenter, ctx.token)

  ctx.body = {
    id: presentationId,
    ...presentation
  }
}

export async function handleRejectPresentation (ctx) {
  const { id: presentationId, eventId } = ctx.params;

  const presentation = await rejectPresentation(eventId, presentationId)

  if (!presentation) {
    ctx.status = 404;
    return ctx.body = {
      code: 'INVALID_IDENTIFIER',
      message: 'Could not reject that presentation.'
    };
  }

  ctx.body = presentation
}