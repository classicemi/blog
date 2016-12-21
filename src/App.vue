<template>
  <div id="app">
    <blogHeader></blogHeader>
    <div class="main">
      <router-view></router-view>
    </div>
    <blogFooter></blogFooter>
  </div>
</template>

<script>
import blogHeader from './components/blogHeader'
import blogFooter from './components/blogFooter'

export default {
  name: 'app',
  components: {
    blogHeader,
    blogFooter
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.main {
  min-height: 100%;
  padding-bottom: 10rem;
}
</style>
