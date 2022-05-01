<template>
  <div
    class="
      input-search flex
      items-center
      content-between
      form-field
      bg-shade-30
      focus-within:bg-shade-20
    "
  >
    <input
      ref="searchInput"
      :value="search"
      @input="(e) => (search = e.target.value)"
      type="search"
      class="w-full !ring-none !outline-none"
      placeholder="search..."
    />
    <button
      class="bg-transparent text-shade-100 mr-2"
      @click="search.length ? (search = '') : $refs.searchInput.select()"
    >
      <Icon :icon="search.length ? 'close' : 'search'" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    search: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
