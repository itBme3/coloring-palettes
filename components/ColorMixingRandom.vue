<template>
  <div class="color-mixing-random">
    <ColorMixingControls
      mix-type="random"
      :palette="palette"
      @colors="(e) => (selectedColors = e)"
      @steps="(e) => (steps = e)"
    />
    <div class="color-results flex flex-wrap w-full">
      <template v-for="(color, i) in results">
        <ColorSwatch
          :key="color.id + '-' + i"
          :delay-show="i * 3"
          :color="color"
          animation-name="scale-fade"
          class="mb-2 mr-2"
          @click="(e) => $emit('selectedColor', color)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import chroma from 'chroma-js';
import { mapGetters } from 'vuex';
import { v4 as uuid } from 'uuid';
export default {
  props: {
    colors: {
      type: Object,
      default: null,
    },
    palette: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      results: [],
      steps: 100,
      selectedColors: [],
    };
  },

  mounted() {
    this.selectedColors =
      Array.isArray(this.colors) && !!this.colors?.length
        ? this.colors
        : this.palette?.colors?.length
        ? this.palette.colors
        : [];
  },

  watch: {
    selectedColors() {
      this.randomColors();
    },
    steps() {
      this.randomColors();
    },
    colors(val) {
      if (!Array.isArray(val)) {
        return;
      }
      this.selectedColors = val;
    },
  },

  methods: {
    randomColors() {
      if (!Array.isArray(this.selectedColors)) {
        return;
      }
      this.results = [];
      for (let i = 0; i < this.steps; i++) {
        this.results.push({ value: chroma.random(), id: uuid() });
      }
    },
  },
};
</script>
