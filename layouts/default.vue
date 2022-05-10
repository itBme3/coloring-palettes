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
    window.addEventListener('scroll', this.onScroll, {passive: true});
    window.addEventListener('resize', this.onResize, {passive: true});
    window.addEventListener('click', this.onClick, {passive: true});
    this.onResize();
    this.onScroll();
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('click', this.onClick);
  },
  methods: {
    onResize() {
      this.$store.commit('window/setSizing');
      if(this.isMobile && this.navCollapsed) {
        this.$gsap.utils.toArray('nav.mobile .nav-link')
          .forEach((link) => this.$gsap.set(link, { x: 100, opacity: 0, scale: .6 }));
      }
    },
    onScroll() {
      this.$store.commit('window/setScrolling')
    },
    onClick(e) {
      this.$store.commit('window/setClick', e)
    }
  }
})
</script>
