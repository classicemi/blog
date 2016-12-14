<template>
  <div class="blog-list">
    blog
    <ul>
      <li v-for="blog in blogList" v-if="blog.state === 'open'">
        {{blog.title}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blogList: []
    }
  },
  computed: {
    blogList() {
      return this.$store.getters.blogList
    }
  },
  beforeMount() {
    this.loadBlogs()
  },
  methods: {
    loadBlogs() {
      this.$store.dispatch('FETCH_BLOG_LIST')
    }
  }
}
</script>

<style lang="scss">
</style>
