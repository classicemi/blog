<template>
  <div class="blog">
    <h1 class="title">
      {{activeBlog.title}}
    </h1>
    <div v-html="activeBlog.content" class="content"></div>
  </div>
</template>

<script>
import {
  wechatShare
} from '../utils'

export default {
  data() {
    return {
      id: this.$route.params.id,
      activeBlog: {}
    }
  },
  computed: {
    activeBlog() {
      const activeBlog = this.$store.getters.activeBlog
      wechatShare({
        title: `${activeBlog.title} | Orange's Blog`,
        link: document.href
      })
      if (activeBlog.title) {
        document.title = `${activeBlog.title} | Orange's Blog`
      } else {
        document.title = 'Orange\'s Blog'
      }
      return activeBlog
    }
  },
  beforeMount() {
    this.loadActiveBlog(this.id)
  },
  beforeDestroy() {
    this.clearActiveBlog()
  },
  methods: {
    loadActiveBlog(id) {
      this.$store.dispatch('FETCH_ACTIVE_BLOG', id)
    },
    clearActiveBlog() {
      this.$store.dispatch('CLEAR_ACTIVE_BLOG')
    }
  }
}
</script>

<style lang="scss">
.blog {
  max-width: 800px;
  margin: 3rem auto 0;
  padding: 0 1rem;
  font-size: 1.4rem;
  line-height: 1.8em;
  .title {
    text-align: center;
    margin: 4rem 0 2rem;
  }
  .content {
    p {
      margin-bottom: 1.2rem;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-bottom: .3rem;
    }
    ul {
      li {
        &:before {
          content: '🔹';
          margin-right: .7rem;
          vertical-align: middle;
        }
      }
    }
    blockquote {
      margin: 0 0 1.2rem 0;
      padding: .3rem 1rem;
      border-left: 4px solid #ccc;
      background-color: #eee;
      color: #666;
    }
    code, pre {
      font-family: 'Source Code Pro', Monaco, Consolas, monospace;
      font-size: 1.2rem;
    }
    code {
      padding: .1rem .3rem;
      background-color: rgba(255, 0, 0, .1);
      color: #c7254e;
    }
    pre {
      padding: 1rem;
      line-height: 1.5em;
      background-color: #eee;
      overflow-x: auto;
      code {
        color: inherit;
        background-color: transparent;
      }
    }
  }
}
</style>
