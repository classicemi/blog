<template>
  <div class="footer">
    <p>
      Proudly powered by <a target="_blank" href="https://github.com/classicemi">myself</a>
    </p>
    <p>
      © 2016 classicemi
    </p>
  </div>
</template>

<script>
export default {
  name: 'blogFooter'
}
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0px;
  box-sizing: border-box;
  width: 100%;
  height: 10rem;
  padding-top: 3rem;
}

p {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.2rem;
}
</style>
