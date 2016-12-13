<template>
  <div class="blog">
    {{activeBlog}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      activeBlog: {}
    };
  },
  computed: {
    activeBlog() {
      console.log(this.$store.getters.activeBlog);
      return this.$store.getters.activeBlog;
    }
  },
  beforeMount() {
    this.id = this.$route.params.id;
    this.getBlog(this.id);
  },
  methods: {
    getBlog(id) {
      this.$store.dispatch('GET_ACTIVE_BLOG', id);
    }
  }
};
</script>

<style lang="scss">
</style>
