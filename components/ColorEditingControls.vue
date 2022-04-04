<template>
  <div class="color-editing-controls">
    <div class="form-field" style="display: flex; align-items: center">
      <label class="padding-right: .5rem">steps: </label>
      <input v-model="inputSteps" type="number" placeholder="steps" />
    </div>

    <div class="saving-palette">
      <button v-if="editingPalette && editingPalette.id" @click="savePalette()">
        create palette
      </button>
    </div>

    <div class="color-editing-palette">
      <h4>👇 editing</h4>

      <!-- <client-only> -->
      <draggable
        class="input-colors"
        style="width: 100%"
        v-model="selectedColors"
        group="selectedColors"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template v-for="(color, i) in selectedColors">
          <ColorSwatch
            :key="color + i"
            :color="color"
            swatch-style="list"
            style="cursor: pointer; width: 100%"
            :actions="['edit', 'duplicate', 'copy', 'remove']"
            @duplicate="() => duplicateColor(i)"
            @color="(e) => setColorValue(i, e)"
            @remove="(e) => removeSelectedColor(i)"
          />
        </template>
      </draggable>
      <!-- </client-only> -->

      <h4>👇 Also In Palette</h4>
      <template v-for="(color, i) in paletteColors">
        <ColorSwatch
          :key="color + i"
          v-if="!selectedColors.includes(color)"
          :color="color"
          swatch-style="list"
          style="cursor: pointer; width: 100%"
          @color="(e) => (color = e)"
          @click="addSelectedColor(color)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import chroma from 'chroma-js';
import draggable from 'vuedraggable';
import { defaultPaletteColors } from '~/utils/colorCollections/';
import { mapGetters } from 'vuex';

export default {
  components: {
    draggable,
  },
  props: {
    colors: {
      type: Array,
      default: () => [],
    },
    palette: {
      type: String,
      default: null,
    },
    steps: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      dragging: false,
    };
  },
  mounted() {
    // this.$store.commit('localStorage/setEditing', {
    //   palette: this.palette,
    //   selectedColors: this.colors,
    //   steps: this.inputSteps,
    //   merge: false,
    // });
  },
  computed: {
    ...mapGetters({
      editingSelectedColors: 'localStorage/editingSelectedColors',
      editingPalette: 'localStorage/editingPalette',
    }),
    inputSteps: {
      get() {
        return this.$store?.state?.localStorage?.editing?.steps || this.steps;
      },
      set(steps) {
        this.$store.commit('localStorage/setEditing', { steps, merge: true });
      },
    },
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
    paletteColors: {
      get() {
        return this.editingPaletteColors;
      },
      set(colors) {
        if (!this.editingPalette) {
          return;
        }
        this.$store.commit('localStorage/setColorsOnPalette', {
          paletteId: this.palette.id,
          colors,
        });
      },
    },
  },

  methods: {
    setColorValue(i, value) {
      const selectedColors = JSON.parse(JSON.stringify(this.selectedColors));
      selectedColors[i] = value;
      this.selectedColors = selectedColors;
    },
    duplicateColor(colorIndex) {
      const selectedColors = JSON.parse(JSON.stringify(this.selectedColors));
      this.selectedColors = [
        ...selectedColors.slice(0, colorIndex + 1),
        selectedColors[colorIndex],
        ...selectedColors.slice(colorIndex + 1, selectedColors.length),
      ];
    },
    removeSelectedColor(colorIndex) {
      const selectedColors = JSON.parse(JSON.stringify(this.selectedColors));
      selectedColors.splice(colorIndex, 1);
      this.selectedColors = selectedColors;
    },
    addSelectedColor(color, append = true) {
      this.$store.commit('localStorage/setEditing', {
        ...(this.$store?.state?.localStorage?.editing || {}),
        selectedColors: append
          ? [...this.selectedColors, color]
          : [color, ...this.selectedColors],
      });
    },
  },
};
</script>

<style lang="scss">
.color-editing-controls {
  width: 200px;
  padding: 1rem;
}
</style>
