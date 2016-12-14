import request from 'superagent'
import { owner, repo } from '../config.json'

const base = `https://api.github.com`
const token = window.btoa(`${owner}:85b8f9dc6a7a94bf6f8408e7ac5510bdd2ea91f2`)
const header = {
  Authorization: `Basic ${token}`
}

export default {
  blogList() {
    return request.get(`${base}/repos/${owner}/${repo}/issues?state=all`).set(header)
  }
}
