import request from 'superagent';
import { owner, repo } from '../config.json';

const base = 'https://api.github.com';
const username = 'classicemi';
const token = '6e0377f30c4ab46379b04a63c2af59162d691650';
const access_token = window.btoa(`${username}:${token}`);
const header = {
  Authorization: `Basic ${access_token}`
};

export default {
  blogList() {
    return request.get(`${base}/repos/${owner}/${repo}/issues?state=all`).set(header);
  },
  blog(id) {
    return request.get(`${base}/repos/${owner}/${repo}/issues/${id}`);
  }
};
