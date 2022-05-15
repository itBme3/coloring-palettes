<template>
  <div class="page !pt-4">
    <div class="flex items-center content-start space-x-2">
      <nuxt-link
        to="/"
        class="button"
        >
        <Icon icon="palettes" class="icon" />
        <small>Palettes</small>
      </nuxt-link>
    </div>
    <div
      class="
      pt-4
        pb-px
        px-6
        -mx-6
        bg-shade-20
        sticky
        top-0
        z-10
        shadow-xl shadow-shade-20
      "
    >
      
      <InputSearch v-model="search" class="mb-0" />
      
    </div>
    <SelectPalette :hide-search="true" :search="search" />
  </div>
</template>

<script>
export default {
  data() {
    return { search: '' };
  },
};
</script>
<style lang="scss" scoped>
 .button {
   @apply rounded-md shadow-lg py-6 sm:py-8 w-1/2 max-w-[190px] text-center;
   .icon {
     @apply text-2xl sm:text-4xl md:text-5xl mr-2 relative top-1;
   }
 }
</style>
