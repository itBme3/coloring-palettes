<template>
  <div class="color-mixing-scale">
    <div
      class="
        color-mixing-controls
        max-w-full
        my-2
        px-3
        pt-2
        pb-1
        rounded-md
        bg-shade-40
      "
    >
      <div
        class="
          flex
          w-32
          mt-2
          content-start
          items-center
          border border-shade-50
          rounded
          mr-auto
          hover:bg-shade-40 hover:border-shade-40
          focus-within:bg-shade-40 focus-within:border-shade-40
          pl-3
        "
      >
        <label for="steps" class="text-xs text-shade-90">steps: </label>
        <input
          type="number"
          name="steps"
          v-model="steps"
          step="10"
          :min="selectedColors.length + 2"
          max="600"
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
        v-model="selectedColors"
        tag="div"
        class="selected-colors space-x-2 mt-2 cursor-move"
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
import draggable from 'vuedraggable';
import chroma from 'chroma-js';
import { mapGetters } from 'vuex';
import { v4 as uuid } from 'uuid';
export default {
  components: { draggable },
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
      steps: 60,
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

  computed: {
    ...mapGetters({
      editingSelectedColors: 'localStorage/editingSelectedColors',
    }),
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

<style scoped>
.selected-colors {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
</style>
