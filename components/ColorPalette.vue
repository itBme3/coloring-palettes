<template>
  <div
    v-if="palette && palette.name"
    class="color-palette mx-auto w-full relative"
  >
    <div class="toggle-buttons flex space-x-2 my-3 relative z-9">
      <button
        v-for="editView in ['palette', 'mixing']"
        :key="editView"
        @click="view = editView"
        class="hover:bg-white hover:text-shade-20"
        :class="{
          'bg-white text-shade-20': editView === view,
        }"
      >
        {{ editView }}
      </button>
    </div>
    <transition name="down-fade" :duration="{ enter: 200, leave: 100 }">
      <input
        v-if="view === 'palette'"
        ref="nameInput"
        class="
          title
          relative
          z-10
          text-4xl
          mb-3
          border-none
          outline-none
          border-transparent
          outline-transparent
          ring-transparent
          hover:bg-shade-60
        "
        type="text"
        :value="palette.name"
        @input="updatePaletteName"
      />
    </transition>
    <transition name="up-fade" :duration="{ enter: 500, leave: 100 }">
      <div
        v-if="view === 'palette'"
        class="color-palette-colors flex flex-col space-y-2"
        style="transition-delay: 0.2s !important"
      >
        <ColorSwatch
          v-for="(color, i) in palette.colors"
          :key="color.value + i"
          :color="color"
          :delay-show="i * 100"
          swatch-style="list-item"
        />
      </div>
    </transition>
    <ColorMixing v-if="view === 'mixing'" :palette-id="palette.id" />
    <ColorPaletteActions :palette="palette" @rename="focusInput" />
  </div>
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
  },
  data() {
    return {
      view: null,
    };
  },
  mounted() {
    this.view = 'palette';
  },
  computed: {
    ...mapGetters({
      storedPalettes: 'storedPalettes',
    }),
    palette() {
      return (
        this.storedPalettes?.filter((p) => p.id === this.paletteId)[0] || null
      );
    },
  },
  watch: {
    palettedId(val) {
      this.palette =
        this.storedPalettes?.filter((p) => p.id === val)[0] || null;
    },
  },
  methods: {
    focusInput() {
      try {
        this.$refs.nameInput.select();
      } catch {}
    },
    updatePaletteName: debounce(function (e) {
      this.$store.dispatch('localStorage/updatePalette', {
        palette: { ...this.palette, name: e.target.value },
      });
    }, 250),
  },
};
</script>
