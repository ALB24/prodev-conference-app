const axios = require('axios')

module.exports = class RESTBase {
  constructor (baseURL) {
    this.http = axios.create({ baseURL })
  }
}