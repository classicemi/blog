import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app';
import store from './store';

import routes from './routes';

Vue.use(VueRouter);
const router = new VueRouter({
  scrollBahavior: () => ({ y: 0 }),
  routes
});

const app = new Vue({
  router,
  store,
  ...App
}).$mount('#app');

export default app;
