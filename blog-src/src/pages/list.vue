<template>
  <div class="blog-list">
    <ul>
      <li v-for="item in displayedBlogList" v-if="item.state === 'open'">
        <router-link :to="{ name: 'blog', params: { id: item.number } }">
          {{item.title}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      displayedBlogList: []
    };
  },
  computed: {
    displayedBlogList() {
      return this.$store.getters.blogList;
    }
  },
  beforeMount() {
    this.loadList();
  },
  methods: {
    loadList() {
      this.$store.dispatch('FETCH_BLOG_LIST');
    }
  }
};
</script>

<style lang="scss">
</style>
