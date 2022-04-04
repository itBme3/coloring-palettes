<template>
  <div
    v-if="palette && palette.name"
    class="color-palette mx-auto w-full relative"
  >
    <input
      ref="nameInput"
      class="title relative z-10 text-4xl"
      type="text"
      :value="palette.name"
      @input="updatePaletteName"
    />
    <div class="toggle-buttons flex space-x-2 my-3">
      <button
        v-for="editView in ['colors', 'mixing']"
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
    <div
      v-if="view === 'colors'"
      class="color-palette-colors flex flex-col space-y-2"
    >
      <ColorSwatch
        v-for="(color, i) in palette.colors"
        :key="color.value + i"
        :color="color"
        swatch-style="list-item"
      />
    </div>
    <ColorMixing v-else-if="view === 'mixing'" :palette-id="palette.id" />
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
      view: 'colors',
    };
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
