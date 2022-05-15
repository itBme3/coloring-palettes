<template>
  <button
    v-if="palette"
    class="color-palette-grid-item grid-item relative text-left"
    :class="{
      ['style-' + itemStyle]: true,
      'group': !swatchClickable
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
      v-if="actions"
      class="
        palette-title
        grid-item-title
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

    <h4 v-else class="grid-item-title">{{ palette.name }}</h4>

    <div v-if="palette.colors" class="colors"
      :class="{'relative z-10': swatchClickable}">
      <ColorSwatch
        v-for="(color, i) in showColors"
        :key="color + '-' + i"
        :color="color"
        :clickable="swatchClickable"
        :actions="false"
        :delay-show="i * 50"
        :swatch-style="swatchStyle"
        class="group"
        @click="e => swatchClickable ? $emit('color', e) : ''"
      >
      <Icon v-if="swatchClickable" 
        icon="add"
        class="m-auto scale-50 opacity-0 group-hover:opacity-75 group-hover:scale-100 transition-all duration-300" />
      </ColorSwatch>
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

      <keep-alive>
        <PopoverActions 
          class="absolute top-4 right-0 z-10"
          :item="palette"
          text-color="rgb(200,200,200)"
        />
      </keep-alive>

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
      default: 'simple',
    },
    swatchClickable: {
      type: Boolean,
      default: false,
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
    this.showColors = this.palette?.colors || [];
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
<style lang="scss">
.color-palette-grid-item {
  .menu-toggle {
    background-color: rgba(0,0,0,.1);
    font-size: 1.3em;
  }
}
</style>
<style lang="scss" scoped>
.colors {
  @apply flex-nowrap;
  
  .color-swatch {
    @apply m-px #{!important};
  }
}
.style-wrap-colors {
  .colors {
    @apply flex-wrap;
    .color-swatch {
      max-width: 30px;
    }
  }
}
</style>