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
              :class="{
                'hover:scale-100 cursor-default': paletteColorValues.includes(color.value)
              }"
              @click="(e) => paletteColorValues.includes(e.value) ? '' : $emit('selectedColor', color)"
            >
            <Transition name="scale-fade-pop">
              <Icon v-if="paletteColorValues.includes(color.value)" 
                icon="check"
                class="absolute right-1 top-0 opacity-70 scale-75 block"
              />
            </Transition>
          </ColorSwatch>
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
      if(!this.selectedColors?.length) { return }
      this.scaleColors();
    },
    steps() {
      if(!this.selectedColors?.length) { return }
      this.scaleColors();
    },
    colors(val) {
      if (!Array.isArray(val)) {
        return;
      }
      this.selectedColors = val;
    },
  },
  computed: {
    paletteColorValues() {
      return this.palette && Array.isArray(this.palette.colors) ? this.palette.colors.map(c => c.value) : []
    }
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
