import Vue from 'vue';
import Vuex from 'vuex';
import api from './api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    lists: {
      blog: []
    },
    activeBlog: {}
  },

  actions: {
    FETCH_BLOG_LIST({ commit }) {
      return api.blogList().then(res => {
        commit('SET_BLOG_LIST', res.body);
      });
    },
    GET_ACTIVE_BLOG({ commit, state }, id) {
      const number = +id;
      const blog = state.lists.blog.find(blog => {
        return blog.number === number;
      });
      if (blog) {
        commit('SET_ACTIVE_BLOG', blog);
      } else {
        api.blog(id).then(res => {
          commit('SET_ACTIVE_BLOG', res.body);
        });
      }
    }
  },

  mutations: {
    SET_BLOG_LIST(state, list) {
      state.lists.blog = list;
    },
    SET_ACTIVE_BLOG(state, blog) {
      state.activeBlog = blog;
    }
  },

  getters: {
    blogList(state) {
      return state.lists.blog;
    },
    activeBlog(state) {
      return state.activeBlog;
    }
  }
});

export default store;
