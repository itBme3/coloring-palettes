<template>
  <div class="select-palette p-4 rounded">
    <InputSearch v-if="!hideSearch" v-model="q" class="mb-0" />
    <div class="palettes space-y-2 relative z-1">
      <ColorPaletteGridItem
        v-for="palette in palettes"
        :key="palette.id"
        :palette-id="palette.id"
        :link="false"
        :actions="false"
        item-style="compact"
        swatch-style="simple"
        @click="$emit('select', palette)"
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
  },
  data() {
    return {
      searchValue: typeof this.search === 'string' ? this.search : '',
    };
  },
  mounted() {
    this.$refs?.searchInput?.select();
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
