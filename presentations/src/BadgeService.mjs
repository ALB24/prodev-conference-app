import axios from 'axios'

export class BadgeService {
  constructor(baseURL) {
    this.client = axios.create({ baseURL })
  }

  transformResponse(res) {
      // TODO: create some contract for this interaction
    return res
  }

  sendPresenter(eventId, presenterInfo, token) {
    return this.client.post(`events/${eventId}/presenters`, presenterInfo, { headers: { Authorization: `Bearer ${ token }`}}).then(this.transformResponse.bind(this)).catch(e => {
      // TODO: create some contract for this failure case
      console.log(e.response.data)
      throw e
    })
  }
}