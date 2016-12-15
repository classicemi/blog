<template>
  <div class="blog">
    {{activeBlog}}
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
</style>
