<template>
  <div class="blog-list">
    <ul class="list">
      <li v-for="blog in blogList" v-if="blog.state === 'open' && !blog.pull_request">
        <router-link :to="{ name: 'blog', params: { id: blog.number } }" class="blog-title">{{blog.title}}</router-link>
        <p class="created-at">{{blog.created_at | date}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    document.title = 'Orange\'s Blog';
    return {
      blogList: []
    }
  },
  computed: {
    blogList() {
      return this.$store.getters.blogList
    }
  },
  filters: {
    date(dateStr) {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}-${month}-${day}`
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

<style lang="scss" scoped>
.list {
  margin-top: 3rem;
  > li {
    position: relative;
    margin: 0 0 1.4rem 0;
    padding: 2rem 0 0 0;
    &:not(:first-child):before {
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -7.5rem;
      content: '';
      display: block;
      width: 15rem;
      height: 1px;
      background-color: #e0e0e0;
    }
  }
  .blog-title {
    display: block;
    color: #000;
    font-size: 1.8rem;
    font-weight: bold;
    text-align: center;
  }
  .created-at {
    text-align: center;
    font-size: 1.3rem;
  }
}
</style>
