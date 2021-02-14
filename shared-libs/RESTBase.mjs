import axios from 'axios'

export class RESTBase {
  constructor (baseURL) {
    this.http = axios.create({ baseURL })
  }
}