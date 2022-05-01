<template>
  <div class="site-container">
    <HeaderNavigation />
    <main class="inline">
      <Nuxt :key="$route.fullPath" />
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  mounted() {
    console.log(this.$store.state.stored.collections);

  }
})
</script>
