<template>
  <button
    v-if="collection"
    class="color-collection-grid-item grid-item relative text-left"
    :class="{
      ['style-' + itemStyle]: true,
      '!py-2 !px-4': itemStyle === 'compact',
    }"
    @click="(e) => $emit('click', e)"
  >
    <h4
      class="collection-title"
      :class="{
        'mb-4': itemStyle !== 'compact',
        'mb-2': itemStyle === 'compact',
      }"
    >
      {{ collection.name }}
    </h4>
    <div class="color-collection-palettes">
      <div
        v-for="(palette, i) in palettes.slice(0, showPalettesCount)"
        :key="palette"
        v-if="palettesMap[palette].name"
        class="color-collection-palette"
        :class="{
          'mb-2': itemStyle !== 'compact',
          'mb-1': itemStyle === 'compact',
        }"
      >
        <p
          v-if="itemStyle !== 'compact'"
          class="palette-title text-sm text-shade-90"
        >
          {{ palettesMap[palette].name }}
        </p>
        <div class="colors">
          <ColorSwatch
            v-for="(color, ii) in palettesMap[palette].colors"
            :key="color + '-' + ii"
            :color="color"
            :clickable="false"
            :actions="false"
            :delay-show="ii * 10"
            swatch-style="simple"
            style="min-width: 20px; width: 100%"
          />
        </div>
      </div>
      <small v-if="palettes.length > showPalettesCount" class="mt-2 block"
        >+ {{ palettes.length - showPalettesCount }} more palettes</small
      >
    </div>
    <nuxt-link
      v-if="link"
      :to="'/collections/' + collection.id"
      class="absolute inset-0 z-9"
    >
    </nuxt-link>
  </button>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    collection: {
      type: Object,
      default: () => null,
    },
    link: {
      type: Boolean,
      default: true,
    },
    itemStyle: {
      type: String,
      default: 'standard',
    },
  },
  data() {
    return {
      showPalettesCount: 3,
    };
  },
  computed: {
    ...mapGetters({
      stroredPalettes: 'storedPalettes',
    }),
    palettes() {
      return this.collection.palettes.filter((pId) =>
        this.stroredPalettes.map((p) => p.id).includes(pId)
      );
    },
    palettesMap() {
      return this.palettes.reduce((acc, paletteId) => {
        return {
          ...acc,
          [paletteId]: this.stroredPalettes.filter(
            (p) => p.id === paletteId
          )[0],
        };
      }, {});
    },
  },
};
</script>

<style lang="scss" scoped>
.colors {
  @apply space-x-px;
}
</style>
