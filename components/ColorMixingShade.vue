<template>
  <div class="color-mixing-shade">
   <ColorMixingResultsWrap>
    <div class="color-results flex flex-col w-full space-y-2">
      <template v-for="(color, i) in results">
        <div class="shade-group flex flex-wrap">
          <template v-for="(shade, ii) in color">
            <ColorSwatch
              v-if="!selectedColors.map((c) => c.value).includes(shade)"
              :key="shade.value + '-' + ii"
              :delay-show="i * ii * 10"
              :color="{ value: shade }"
              animation-name="scale-fade"
              style="margin: 0.25rem"
              @click="
                (e) => $emit('selectedColor', { value: shade, id: uuid() })
              "
            />
          </template>
        </div>
      </template>
    </div>
   </ColorMixingResultsWrap>
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
    selectedColors: {
      type: Array,
      default: () => []
    },
    steps: {
      type: [Number, String],
      default: 10
    }
  },
  data() {
    return {
      results: [],
      uuid,
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
      this.shadeColors();
    },
    steps() {
      this.shadeColors();
    },
    colors(val) {
      if (!Array.isArray(val)) {
        return;
      }
      this.selectedColors = val;
    },
  },

  methods: {
    shadeColors() {
      const stepsInt = parseInt(this.steps);
      const padded = stepsInt < 20 ? 1 : stepsInt < 40 ? 2 : 3;
      const steps = stepsInt + padded * 2;
      this.results = [];
      this.results = this.selectedColors.reduce((acc, color) => {
        const addedShades = chroma
          .scale(['black', color.value, 'white'])
          .colors(steps)
          .slice(padded, steps - padded);
        return [...acc, ...[new Set(addedShades)]];
      }, []);
    },
  },
};
</script>
