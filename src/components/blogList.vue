<template>
  <div class="blog-list">
    <h1 class="title">
      <span>Orange</span>
    </h1>
    <p class="motto">
      all work and no play makes jack a dull boy
    </p>
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
.blog-list {
  padding-top: 5rem;
}

.title {
  text-align: center;
  > span {
    display: inline-block;
    padding: 0 .4rem .1rem;
    background: red;
    font-style: italic;
    color: white;
  }
}

.motto {
  margin-top: .3rem;
  text-align: center;
}

.list {
  margin-top: 4rem;
  > li {
    &:after {
      content: '';
      display: block;
    }
  }
  .blog-title {
    display: block;
    color: #000;
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
  }
  .created-at {
    text-align: center;
  }
}
</style>
