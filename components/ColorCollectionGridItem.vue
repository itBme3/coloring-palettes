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
      class="collection-title grid-item-title"
      :class="{
        'mb-4': itemStyle !== 'compact',
        'mb-2': itemStyle === 'compact',
      }"
    >
      {{ collection.name }}
    </h4>
    <div class="color-collection-palettes">
      <div
        v-for="(palette, i) in (showPalettesCount > 0  ? palettes.slice(0, showPalettesCount) : palettes)"
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
        <div 
          class="colors flex flex-wrap w-full"
          :class="{
            'flex flex-nowrap': palettesMap[palette].colors.length < 14,
            '': palettesMap[palette].colors.length >= 14,
          }">
          <ColorSwatch
            v-for="(color, ii) in palettesMap[palette].colors"
            :key="color + '-' + ii"
            :color="color"
            :clickable="false"
            :actions="false"
            :delay-show="ii * 10"
            swatch-style="simple"
            :style="{minWidth: '20px', width: `calc(100% / ${palettesMap[palette].colors.length})`}"
          />
        </div>
      </div>
      <small v-if="showPalettesCount > 0 && palettes.length > showPalettesCount" class="mt-2 block"
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
    showPalettesCount: {
      type: Number,
      default: 0,
    },
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
</style>
