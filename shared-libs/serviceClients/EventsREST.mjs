import {
  RESTBase
} from './RESTBase.mjs'

export class EventsREST extends RESTBase {
  getAccountId(eventId, token) {
    return this.http.get(`/${eventId}/account`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(this.transformResponse.bind(this))
      .catch(this.transformError.bind(this))
  }
}