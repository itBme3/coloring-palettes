<template>
  <button
    v-if="palette"
    class="color-palette-grid-item grid-item relative group text-left"
    :class="{
      ['style-' + itemStyle]: true,
    }"
    @mouseleave="
      $emit('hovered', false);
      hovered = false;
    "
    @mouseenter="
      $emit('hovered', true);
      hovered = true;
    "
    @click="(e) => $emit('click', e)"
  >
    <input
      class="
        palette-title
        relative
        z-10
        bg-transparent
        hover:bg-shade-20
        bg-opacity-10
        pl-0
        hover:pl-2
        focus:pl-2
        mb-2
      "
      ref="paletteNameInput"
      :value="palette.name"
      @input="(e) => updatePaletteName(e.target.value)"
    />
    <div v-if="palette.colors" class="colors">
      <ColorSwatch
        v-for="(color, i) in showColors"
        :key="color + '-' + i"
        :color="color"
        :clickable="false"
        :actions="false"
        :delay-show="i * 50"
        :swatch-style="swatchStyle"
      />
    </div>

    <nuxt-link
      v-if="link"
      :to="
        collectionId
          ? '/collections/' + collectionId + '/' + palette.id
          : '/palettes/' + palette.id
      "
      class="absolute inset-1 z-1"
    ></nuxt-link>

    <div
      class="overlay absolute inset-0 z-99"
      v-if="!hovered"
      @click="
        $emit('hovered', true);
        hovered = true;
      "
    />

    <Transition v-if="actions" name="scale-fade-items">
      <keep-alive>
        <ColorPaletteActions
          class="absolute right-2 top-0 transform scale-[0.7] translate-x-[15%]"
          :palette="palette"
          :show="hovered"
          @rename="$refs.paletteNameInput.select()"
        />
      </keep-alive>
    </Transition>
  </button>
</template>
<script>
import { debounce } from 'lodash';
import { mapGetters } from 'vuex';
export default {
  props: {
    paletteId: {
      type: String,
      default: null,
    },
    collectionId: {
      type: String,
      default: null,
    },
    itemStyle: {
      type: String,
      default: 'standard',
    },
    swatchStyle: {
      type: String,
      default: 'tile',
    },
    link: {
      type: Boolean,
      default: true,
    },
    actions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showColors: [],
      hovered: false,
    };
  },
  mounted() {
    this.showColors = this.palette?.colors?.slice(0, 10) || [];
  },
  computed: {
    ...mapGetters({
      storedPalettes: 'storedPalettes',
      deletedPalettes: 'deletedPalettes',
    }),
    palette() {
      return (
        this.storedPalettes?.filter((p) => p.id === this.paletteId)[0] || null
      );
    },
  },
  methods: {
    showMoreColors() {
      const currentCount = this.showColors.length;
      if (this.showColors?.length >= this.palette.colors?.length) {
        return;
      }
      this.palette.colors
        .slice(currentCount, currentCount + 6)
        .forEach((c) => this.showColors.push(c));
    },
    updatePaletteName: debounce(function (name) {
      this.$store.dispatch('updatePalette', {
        palette: { ...this.palette, name },
      });
    }, 250),
  },
};
</script>