<template>
  <div class="color-mixing-scale">
      <ColorMixingResultsWrap>
        <div class="color-results flex flex-wrap justify-center w-full">
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
      </ColorMixingResultsWrap>
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
