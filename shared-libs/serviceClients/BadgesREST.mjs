import {
  RESTBase
} from './RESTBase.mjs'

export class BadgesREST extends RESTBase {
  sendPresenter(eventId, presenterInfo, token) {
    return this.http.post(`events/${eventId}/presenters`, presenterInfo, {
        headers: {
          Authorization: `Bearer ${ token }`
        }
      })
      .then(this.transformResponse.bind(this))
      .catch(this.transformError.bind(this))
  }
}