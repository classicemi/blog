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
      const cache = localStorage.getItem('blog-blogs')
      if (cache) {
        commit('SET_BLOG_LIST', JSON.parse(cache))
      }
      return api.blogList().then(res => {
        localStorage.setItem('blog-blogs', JSON.stringify(res.body))
        commit('SET_BLOG_LIST', res.body)
      })
    },
    FETCH_ACTIVE_BLOG({ commit, state }, id) {
      const cache = localStorage.getItem(`blog-issue-${id}`)
      if (cache) {
        commit('SET_ACTIVE_BLOG', JSON.parse(cache))
      }
      return api.blog(id).then(res => {
        localStorage.setItem(`blog-issue-${id}`, JSON.stringify(res.body))
        commit('SET_ACTIVE_BLOG', res.body)
      })
    },
    CLEAR_ACTIVE_BLOG({ commit }) {
      commit('CLEAR_ACTIVE_BLOG')
    }
  },

  mutations: {
    SET_BLOG_LIST(state, list) {
      state.blogList = list
    },
    SET_ACTIVE_BLOG(state, blog) {
      state.activeBlog = blog
    },
    CLEAR_ACTIVE_BLOG(state) {
      state.activeBlog = null
    }
  },

  getters: {
    blogList(state) {
      return state.blogList
    },
    activeBlog(state) {
      return state.activeBlog
    }
  }
})

export default store
