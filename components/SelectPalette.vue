<template>
  <div class="select-palette p-4 rounded">
    <div
      class="
        flex
        items-center
        content-between
        bg-shade-40
        rounded
        px-2
        py-1
        mb-2
        focus-within:bg-shade-50
        focus-within:ring-purple-500
        focus-within:ring-2
      "
    >
      <input
        ref="searchInput"
        v-model="search"
        type="search"
        class="w-full !ring-none !outline-none"
        placeholder="search..."
      />
      <button
        class="bg-transparent text-shade-100"
        @click="search.length ? (search = '') : $refs.searchInput.select()"
      >
        <Icon :icon="search.length ? 'close' : 'search'" />
      </button>
    </div>
    <div class="palettes space-y-2">
      <ColorPaletteGridItem
        v-for="palette in palettes"
        :key="palette.id"
        :palette-id="palette.id"
        :link="false"
        :actions="false"
        item-style="compact"
        swatch-style="simple"
        @click="selectPalette(palette)"
        class="!hover:scale-103"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      search: '',
    };
  },
  mounted() {
    this.$refs.searchInput.select();
  },
  computed: {
    ...mapGetters({
      storedPalettes: 'storedPalettes',
    }),
    palettes() {
      const words = this.search.split(' ').map((w) => w.toLowerCase().trim());
      return !this.search?.length
        ? this.storedPalettes
        : this.storedPalettes.filter(
            (p) =>
              words.filter((w) => JSON.stringify(p).toLowerCase().includes(w))
                .length === words.length
          );
    },
  },
  methods: {
    selectPalette(palette) {
      console.log(palette);
    },
  },
};
</script>
