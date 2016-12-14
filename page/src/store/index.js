import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    blogList: [],
    activeBlog: null
  },

  actions: {
    FETCH_BLOG_LIST({ commit }) {
      return api.blogList().then(res => {
        commit('SET_BLOG_LIST', res.body)
      })
    }
  },

  mutations: {
    SET_BLOG_LIST(state, list) {
      state.blogList = list
    }
  },

  getters: {
    blogList(state) {
      return state.blogList
    }
  }
})

export default store
