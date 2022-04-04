<template>
  <nav class="header-navigation flex flex-col items-start content-center">
    <nuxt-link
      to="/collections"
      v-tooltip.right="{ content: 'collections', offset: '5px' }"
      ><Icon icon="layer-group"
    /></nuxt-link>
    <nuxt-link
      to="/palettes"
      v-tooltip.right="{ content: 'palettes', offset: '5px' }"
      ><Icon icon="palettes"
    /></nuxt-link>
  </nav>
</template>
<style lang="scss">
.header-navigation {
  @apply w-auto fixed left-0 top-0 p-1 z-9999;
  a {
    @apply w-8 h-8 flex items-center content-center rounded bg-shade-30 transform scale-90 hover:scale-100 transition-all ease-in-out hover:bg-shade-40 m-auto text-shade-150 hover:text-white;
    > * {
      @apply m-auto;
    }
    &.nuxt-link-active {
      @apply text-white;
    }
    &.nuxt-link-exact-active {
      @apply cursor-default;
    }
  }
}
</style>
