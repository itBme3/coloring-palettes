<template>
  <div class="select-palette rounded p-2 pt-4">
    <InputSearch 
      v-if="!hideSearch"
      ref="searchInput"
      v-model="q"
      class="mb-3 mx-1"
    />
    <div class="palettes space-y-2 relative z-1">
      <ColorPaletteGridItem
        v-for="palette in palettes"
        :key="palette.id"
        :palette-id="palette.id"
        :link="false"
        :actions="false"
        :item-style="itemStyle"
        :swatch-style="swatchStyle"
        :swatch-clickable="swatchClickable"
        @click="$emit('select', palette)"
        @color="e => $emit('color', e)"
        class="!hover:scale-103"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    search: {
      type: String,
      default: '',
    },
    hideSearch: {
      type: Boolean,
      default: false,
    },
    swatchClickable: {
      type: Boolean,
      default: false,
    },
    itemStyle: {
      type: String,
      default: 'compact',
    },
    swatchStyle: {
      type: String,
      default: 'simple',
    },
  },
  data() {
    return {
      searchValue: typeof this.search === 'string' ? this.search : '',
    };
  },
  mounted() {
    this.$refs?.searchInput?._vnode?.children.forEach(child => child.tag === 'input' ? child.elm.focus() : '')
  },
  computed: {
    ...mapGetters({
      storedPalettes: 'storedPalettes',
    }),
    q: {
      get() {
        return this.searchValue;
      },
      set(val) {
        this.searchValue = val;
        this.$emit('input', val);
      },
    },
    palettes() {
      const words = this.q.split(' ').map((w) => w.toLowerCase().trim());
      return !this.q?.length
        ? this.storedPalettes
        : this.storedPalettes.filter(
            (p) =>
              words.filter((w) => JSON.stringify(p).toLowerCase().includes(w))
                .length === words.length
          );
    },
  },
  watch: {
    search(val) {
      this.q = val;
    },
  },
};
</script>
<style lang="scss">
.input-search {
  @apply mb-3
}
</style>
