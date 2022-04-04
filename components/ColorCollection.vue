<template>
  <div v-if="collection" class="color-collection mx-auto w-full relative">
    <input
      class="title relative z-10 text-4xl"
      type="text"
      :value="collection.name"
      @input="updateCollectionName"
    />
    <div class="palettes'">
      <ColorPaletteGridItem
        v-for="palette in showPalettes"
        :key="palette"
        :palette-id="palette"
        :collection-id="collectionId"
        class="hover:scale-100 !border-transparent !shadow-none"
      />
    </div>
    <template v-if="showPalettes.length < collection.palettes.length">
      <div v-view="showMorePalettes">
        <button
          class="
            text-xs
            border-1 border-gray-400 border-opacity-20
            bg-transparent
          "
          @click="showMorePalettes"
        >
          More Palettes
        </button>
      </div>
    </template>
  </div>
</template>
<script>
import { debounce } from 'lodash';
import { mapGetters } from 'vuex';
export default {
  props: {
    collectionId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      showPalettes: this.collection?.palettes?.slice(0, 6) || [],
    };
  },
  mounted() {
    this.showMorePalettes();
  },
  computed: {
    ...mapGetters({
      collections: 'storedCollections',
    }),
    collection() {
      return (
        this.collections?.filter((c) => c.id === this.collectionId)[0] || null
      );
    },
  },
  methods: {
    showMorePalettes: debounce(function () {
      const currentCount = this.showPalettes.length;
      if (this.showPalettes?.length >= this.collection.palettes?.length) {
        return;
      }
      this.collection.palettes
        .slice(currentCount, currentCount + 8)
        .forEach((c) => this.showPalettes.push(c));
    }, 100),
    updateCollectionName(e) {
      this.$store.dispatch('localStorage/updateCollection', {
        collection: {
          ...this.collection,
          name: e.target.value,
        },
      });
    },
  },
};
</script>

<style lang="scss">
input {
  background: transparent;
  border: 0 !important;
  border-radius: 0.1rem;
  &:hover {
    outline: 2px solid rgb(150, 150, 160);
  }
}
</style>
