import axios from 'axios'

export class RESTBase {
  constructor(baseURL) {
    this.http = axios.create({
      baseURL
    })
  }

  transformResponse(res) {
    return res
  }

  transformError(err) {
    console.error(err.response.data)
    throw err
  }
}