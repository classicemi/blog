// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
import store from './store'

import './style/main.css'

// const resetRootFontSize = () => {
//   const clientWidth = document.body.clientWidth
//   document.documentElement.style.fontSize = 10 * (clientWidth / 375) + 'px'
// }
// resetRootFontSize()
// window.addEventListener('resize', resetRootFontSize)

Vue.use(VueRouter)

const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
})
