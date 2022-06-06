<template>
  <div class="color-mixing-controls">
    <div
      class="max-w-full mb-2 pb-3 rounded-md"
    >
      <div
        class="form-field w-32 mt-2 pl-3 py-1 flex items-center focus-within:border-0"
        @click="$refs.stepInput.focus()"
      >
        <label for="steps" class="text-xs text-shade-90">steps: </label>
        <input
          type="number"
          ref="stepInput"
          name="steps"
          v-model="steps"
          :step="mixType === 'random' ? 10 : 3"
          class="w-full max-w-xl py-1 border-none ring-0 outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none"
        />
      </div>
      <div class="flex items-center mt-2 relative">
        <SelectColor
          v-if="selectedColors.length < maxSelected"
          @update="e => {
            selectedColors.shift()
            selectedColors.unshift(e)
          }"
          @color="e => selectedColors.unshift(e)"
          :palette-id="palette.id"
        />
        <draggable
          v-if="!['random'].includes(mixType)"
          v-model="selectedColors"
          tag="div"
          class="selected-colors flex space-x-2 my-auto ml-3"
        >
          <ColorSwatch
            v-for="(color, i) in selectedColors"
            handle=".drag-handle"
            :key="color.id"
            :color="color"
            :actions="false"
            class="group"
            animation-name="scale-fade-pop"
            :draggable="true"
            :only-emit="true"
            @color="(e) => updateColor(color, e)"
          >
            <Icon
              :key="'close'"
              class="
                text-base
                cursor-pointer
                absolute
                right-1
                top-1
                opacity-0
                group-hover:opacity-40
              "
              icon="close"
              @click="selectedColors.splice(i, 1)"
            />
          </ColorSwatch>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import Popover from './Popover.vue';
export default {
  components: { draggable, Popover },
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
      editingColor: null,
      maxSelected: 9
    };
  },
  mounted() {
    this.selectedColors = JSON.parse(
      JSON.stringify(
        Array.isArray(this.colors) && !!this.colors?.length
          ? this.colors
          : this.palette?.colors
          ? JSON.parse(JSON.stringify(this.palette.colors.slice(0, 6)))
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
  methods: {
    updateColor(color, value) {
      this.selectedColors = this.selectedColors.map(c => {
        return c.id === color.id 
          ? { ...c, value }
          : c
      })
    }
  }
};
</script>
<style lang="scss">
.add-color {
  @apply flex items-center content-center border-2 border-dashed hover:border-solid text-center;
  @apply hover:bg-shade-20 border-shade-30 #{!important};
}
</style>