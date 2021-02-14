import { RESTBase } from './RESTBase.mjs'

export class BadgesREST extends RESTBase{
  transformResponse(res) {
    return res
  }

  transformError(err) {
    return err
  }

  sendPresenter(eventId, presenterInfo, token) {
    return this.http.post(`events/${eventId}/presenters`, presenterInfo, { headers: { Authorization: `Bearer ${ token }`}}).then(this.transformResponse.bind(this)).catch(e => {
      // TODO: create some contract for this failure case
      console.log(e.response.data)
      throw e
    })
  }
}