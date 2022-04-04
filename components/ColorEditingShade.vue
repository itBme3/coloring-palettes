<template>
  <div class="color-editing-shade">
    <div style="display: flex; flex-wrap: wrap">
      <template v-for="(color, i) in results">
        <div
          class="shade-group"
          style="margin: 0.5rem 0; display: flex; flex-wrap: wrap"
        >
          <template v-for="(shade, ii) in color">
            <ColorSwatch
              v-if="!selectedColors.map((c) => c.value).includes(shade)"
              :key="shade.value + '-' + ii"
              :delay-show="i * 3"
              :color="{ value: shade }"
              animation-name="scale-fade"
              style="margin: 0.25rem"
              @click="(e) => selectedColors.push(e)"
            />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import chroma from 'chroma-js';
import { mapGetters } from 'vuex';

export default {
  props: {
    steps: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      pickerValue: chroma.random().hex(),
      results: [],
    };
  },

  mounted() {
    this.shadeColors();
  },

  computed: {
    ...mapGetters({ selectedColors: 'localStorage/editingSelectedColors' }),
  },

  watch: {
    selectedColors(val) {
      this.shadeColors();
    },
    steps() {
      this.shadeColors();
    },
  },

  methods: {
    shadeColors() {
      const padded = this.steps < 10 ? 1 : this.steps < 20 ? 2 : 3;
      const steps = this.steps + padded * 2;
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

<style scoped>
.selected-colors {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
</style>
