import request from 'superagent'
import { owner, repo } from '../config.json'

const base = `https://api.github.com`
const token = window.btoa(`${owner}:41db639374e2b3a0ab5e46147fcffa59f2170fba`)
const header = {
  Authorization: `Basic ${token}`
}

export default {
  blogList() {
    return request.get(`${base}/repos/${owner}/${repo}/issues?state=all`).set(header)
  },
  blog(id) {
    return request.get(`${base}/repos/${owner}/${repo}/issues/${id}`).set(header)
  },
  markdown(text) {
    const params = {
      text,
      mode: 'gfm',
      context: `${owner}/${repo}`
    }
    return request.post(`${base}/markdown`)
        .set('Content-Type', 'application/json')
        .set(header)
        .send(JSON.stringify(params))
  }
}
