<template>
  <div class="color-mixing-controls">
    <div
      class="max-w-full my-2 px-3 pt-1 pb-3 rounded-md bg-shade-40 shadow-lg"
    >
      <div
        class="form-field w-32 mt-2 pl-3 py-1"
        @click="$refs.stepInput.focus()"
      >
        <label for="steps" class="text-xs text-shade-90">steps: </label>
        <input
          type="number"
          ref="stepInput"
          name="steps"
          v-model="steps"
          :step="mixType === 'random' ? 10 : 3"
          class="
            w-full
            !border-none
            !ring-0
            !outline-none
            !focus:border-none !focus:ring-0 !focus:outline-none
          "
        />
      </div>
      <draggable
        v-if="!['random'].includes(mixType)"
        v-model="selectedColors"
        tag="div"
        class="selected-colors flex space-x-2 mt-2 cursor-move"
      >
        <ColorSwatch
          v-for="color in selectedColors"
          handle=".drag-handle"
          :key="color.id"
          :color="color"
          :actions="true"
          class="group"
        >
          <Icon
            :key="'drag-handle'"
            class="
              drag-handle
              text-base
              cursor-move
              absolute
              left-1
              top-1
              opacity-0
              group-hover:opacity-40
              text-black
            "
            icon="grip"
          />
        </ColorSwatch>
      </draggable>
    </div>
    <h4 class="text-md text-shade-110 mb-2">Results:</h4>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  components: { draggable },
  props: {
    colors: {
      type: Array,
      default: () => null,
    },
    palette: {
      type: Object,
      default: () => null,
    },
    mixType: {
      type: String,
      default: null /* scale, shade, random */,
    },
  },
  data() {
    return {
      steps:
        this.mixType === 'shade' ? 10 : this.mixType === 'random' ? 100 : 60,
      selectedColors: [],
    };
  },
  mounted() {
    this.selectedColors = JSON.parse(
      JSON.stringify(
        Array.isArray(this.colors) && !!this.colors?.length
          ? this.colors
          : this.palette?.colors
          ? this.palette.colors
          : []
      )
    );
  },
  watch: {
    selectedColors(val) {
      this.$emit('colors', val);
    },
    steps(val) {
      this.$emit('steps', val);
    },
  },
};
</script>
