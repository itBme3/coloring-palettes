<template>
  <div class="flex flex-col items-center content-center w-[calc(100%)] p-12 mx-auto space-y-8">
    <div v-if="picked && picked.value" class="w-auto py-3 px-2" :style="{backgroundColor: picked.value }">{{ picked.value }}</div>
    <draggable
          tag="div"
          class="selected-colors flex flex-col space-y-2 my-auto"
        >
    <!-- <div class="flex flex-col space-y-2 w-full"> -->
      <ColorSwatch
        v-for="(color, i) in colors"
        :key="0 + color + i"
        :actions="true"
        :draggable="true"
        swatch-style="list-item"
        @updateColor="(e) => picked = e"
        class="group"
        ref="colorSwatch"
      >
        <Icon
          :key="'drag-handle'"
          class="drag-handle cursor-move text-base
            absolute left-3 top-1/2 -translate-y-1/2 opacity-0 
            group-hover:opacity-30 hover:opacity-60 text-shade-90"
          icon="grip"
        />
      </ColorSwatch>
    <!-- </div> -->
    </draggable>
    <div class="flex flex-row space-x-2">
      <ColorSwatch
        v-for="(color, i) in colors"
        :key="1 + color + i"
        :actions="true"
        swatch-style="tile"
        @updateColor="(e) => picked = e"
      />
    </div>
    <div class="flex flex-row space-x-2">
      <ColorSwatch
        v-for="(color, i) in colors"
        :key="2 + color + i"
        swatch-style="simple"
        @updateColor="(e) => picked = e"
      />
    </div>


    <Popover ref="popover" class="m-auto">
      <template #target>
        <button class="button">
          click me
        </button>
      </template>
      <div class="h-64 flex items-center content-center w-4xl">
        <span>that worked 🙌</span>
      </div>
    </Popover>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
  export default Vue.extend({
    components: {
      draggable
    },
    data() {
        return { picked: null };
    },
    computed: {
        ...mapGetters({
          palettes: 'storedPalettes'
        }),
        colors() {
          return this.palettes.filter(p => p.name === 'Bubbles')[0].colors
        }
    },
    methods: {
        selectColor(e) {
            console.log(this.$refs.popoverElem);
        }
    },
})
</script>

<style scoped>

</style>