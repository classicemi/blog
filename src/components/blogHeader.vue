<template>
  <div class="header">
    <h1 class="title">
      <span>
        <router-link :to="{ name: 'root' }">Orange</router-link>
      </span>
    </h1>
    <p class="motto">
      all work and no play makes jack a dull boy
    </p>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.header {
  padding-top: 5rem;
}

.title {
  text-align: center;
  > span {
    display: inline-block;
    padding: 0 .4rem .1rem;
    background: red;
    font-style: italic;
    font-size: 3rem;
    a {
      color: white;
    }
  }
}

.motto {
  margin-top: 1rem;
  text-align: center;
  font-size: 1.4rem;
}
</style>
