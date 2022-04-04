<template>
  <div class="color-editing-scale">
    <div style="display: flex; flex-wrap: wrap">
      <template v-for="(color, i) in results">
        <ColorSwatch
          :key="color.value + '-' + i"
          :delay-show="i * 3"
          :color="{ value: color }"
          animation-name="scale-fade"
          style="margin: 0.25rem"
          @click="(e) => (selectedColors = [...selectedColors, e])"
        />
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
      default: 100,
    },
  },
  data() {
    return {
      results: [],
    };
  },

  mounted() {
    this.scaleColors();
  },

  computed: {
    ...mapGetters({
      editingSelectedColors: 'localStorage/editingSelectedColors',
    }),
    selectedColors: {
      get() {
        return this.editingSelectedColors;
      },
      set(selectedColors) {
        this.$store.commit('localStorage/setEditing', {
          selectedColors,
          merge: true,
        });
      },
    },
  },

  watch: {
    selectedColors() {
      this.scaleColors();
    },
    steps() {
      this.scaleColors();
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
        ),
      ];
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
