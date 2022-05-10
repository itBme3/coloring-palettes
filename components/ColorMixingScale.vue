<template>
  <div class="color-mixing-scale">
      <ColorMixingResultsWrap>
        <div class="color-results flex flex-wrap justify-center w-full">
            <ColorSwatch
              v-for="color in results"
              :key="color.id"
              :color="color"
              animation-name="scale-fade"
              :animation-delay="0"
              :update-color-swatch-click="false"
              class="mb-2 mr-2"
              @click="(e) => $emit('selectedColor', color)"
            />
        </div>
      </ColorMixingResultsWrap>
  </div>
</template>

<script>
import chroma from 'chroma-js';
import { v4 as uuid } from 'uuid';
export default {
  props: {
    colors: {
      type: Array,
      default: [],
    },
    palette: {
      type: Object,
      default: null,
    },
    steps: {
      type: [Number, String],
      default: 60
    }
  },
  data() {
    return {
      results: [],
      selectedColors: [],
    };
  },

  mounted() {
    this.selectedColors = this.colors || [];
  },

  watch: {
    selectedColors() {
      // console.log(this.selectedColors)
      if(!this.selectedColors?.length) { return }
      this.scaleColors();
    },
    steps() {
      this.scaleColors();
    },
    colors(val) {
      if (!Array.isArray(val)) {
        return;
      }
      this.selectedColors = val;
    },
  },

  methods: {
    scaleColors() {
      if (!Array.isArray(this.selectedColors)) {
        return;
      }
      this.results = [
        ...new Set(
          chroma
            .scale(
              this.selectedColors
                .map((c) => c.value)
                .filter((c) => chroma.valid(c))
            )
            .colors(this.steps)
            .map((value) => {
              return {
                value,
                id: uuid(),
              };
            })
        ),
      ];
    },
  },
};
</script>
