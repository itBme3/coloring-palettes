<template>
  <div class="inline">
    <div
      class="
        pt-3
        px-3
        pb-px
        bg-shade-30
        sticky
        top-0
        z-10
        shadow-xl shadow-shade-30
      "
    >
      <InputSearch v-model="search" class="mb-0" />
    </div>
    <SelectPalette :hide-search="true" :search="search" />
    <SelectCollection :hide-search="true" :search="search" />
  </div>
</template>

<script>
export default {
  data() {
    return { search: '' };
  },
};
</script>
