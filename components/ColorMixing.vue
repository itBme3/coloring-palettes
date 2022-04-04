<template>
  <div class="color-mixing">
    <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
      <div v-if="view" class="toggle-buttons space-x-2">
        <button
          v-for="editView in ['scale', 'shade', 'random']"
          :key="editView"
          class="hover:bg-white hover:text-shade-20 text-sm"
          :class="{
            'bg-white text-shade-20': editView === view,
          }"
          @click="view = editView"
        >
          {{ editView }}
        </button>
      </div>
    </transition>
    <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
      <ColorMixingScale
        v-if="view === 'scale'"
        :palette="palette"
        @selectedColor="(e) => newColor(e)"
      />
    </transition>

    <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
      <ColorMixingShade
        v-if="view === 'shade'"
        :palette="palette"
        @selectedColor="(e) => newColor(e)"
      />
    </transition>

    <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
      <ColorMixingRandom
        v-if="view === 'random'"
        :palette="palette"
        @selectedColor="(e) => newColor(e)"
      />
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import chroma from 'chroma-js';
export default {
  props: {
    paletteId: {
      type: String,
      default: null,
    },
  },
  data() {
    return { view: null };
  },
  mounted() {
    this.view = 'scale';
  },
  computed: {
    ...mapGetters({
      storedPalettes: 'storedPalettes',
    }),
    palette() {
      return (
        this.storedPalettes.filter((p) => p.id === this.paletteId)[0] || null
      );
    },
  },
  methods: {
    newColor(color) {
      const newColor = { ...color, value: chroma(color.value).hex() };
      console.log({ newColor });
      this.$store.dispatch('localStorage/addColorToPalette', {
        color: newColor,
        paletteId: this.palette.id,
      });
    },
  },
};
</script>
