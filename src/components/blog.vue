<template>
  <div class="blog">
    <div v-html="activeBlog.content" class="content"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      activeBlog: {}
    }
  },
  computed: {
    activeBlog() {
      return this.$store.getters.activeBlog
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
  margin-top: 3rem;
  padding: 0 1rem;
  font-size: 1.4rem;
  line-height: 1.8em;
  .content {
    a {
      color: #4078c0;
    }
    p {
      margin-bottom: 1.2rem;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-bottom: .3rem;
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
      code {
        color: inherit;
        background-color: transparent;
      }
    }
  }
}
</style>
