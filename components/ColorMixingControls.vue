<template>
  <div class="color-mixing-controls">
    <div
      class="max-w-full my-2 pt-1 pb-3 rounded-md"
    >
      <div
        class="form-field w-32 mt-2 pl-3 py-1 flex items-center"
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
      <div class="flex items-center mt-2 relative">
        <draggable
          v-if="!['random'].includes(mixType)"
          v-model="selectedColors"
          tag="div"
          class="selected-colors flex space-x-2 my-auto"
        >
          <ColorSwatch
            v-for="(color, i) in selectedColors"
            handle=".drag-handle"
            :key="color.id"
            :color="color"
            :actions="false"
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
                text-black
              "
              icon="close"
              @click="selectedColors.splice(i, 1)"
            />
          </ColorSwatch>
        </draggable>
        <v-popover
          v-if="selectedColors.length < 6"
          class="mr-auto"
          :handle-resize="true"
          popover-class="flex flex-col shadow-lg !-left-[50px] mt-10"
          placement="right-start"
          ref="popoverElem">
            <div v-if="selectedColors.length < 6"
              class="add-color color-swatch ml-3 text-base">
              <Icon class="m-auto" icon="add" />
            </div>
            <template slot="popover">
              <div class="max-w-lg mx-auto flex flex-col pt-1 pb-2"
                @click="resizePopover">
                <button class="button ml-auto mr-0 mb-1 !py-1" v-close-popover><Icon icon="close" /></button>
                <Transition name="down-fade">
                  <SelectColor 
                    @color="e => {
                      color = e;
                      $refs.popoverElem.hide()
                    }" 
                  />
                </Transition>
              </div>
            </template>
          </v-popover>
        
      </div>
    </div>
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
    resizePopover() {
      setTimeout(() => {
        console.log(this.$refs.popoverElem)
      }, 500)
    }
  }
};
</script>
<style lang="scss">
.add-color {
  @apply flex items-center content-center border-2 border-dashed hover:border-solid hover:bg-shade-30 border-shade-30 text-center;
}
</style>