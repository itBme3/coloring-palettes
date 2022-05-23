<template>
  <div class="flex flex-col items-center content-center w-[calc(100%)] p-12 pr-0 mx-auto space-y-8 h-screen">
    <ColorSwatch
      :palette="palettes[0]"
      :color="palettes[0].colors[0]"
      swatch-style="list-item"
      :actions="true"
    />

  <ItemActions :item="palettes[0].colors[0]" />
      <!-- <Popover> -->
        <!-- <button @click="$refs.popActions.show()">test</button>
        <PopoverActions ref="popActions" action="color" :item="palettes[0].colors[0]" /> -->
      <!-- </Popover> -->

    <Popover :close-on-click="false" ref="popover" class="m-auto" max-width="600px" :classes="{container: 'p-6 w-[600px]'}">
      <template #trigger>
        <button class="button">
          click me
        </button>
      </template>
      <div class="h-[200vh] flex items-center content-center w-4xl">
        <span>that worked 🙌</span>
      </div>
    </Popover>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import PopoverActions from '../components/PopoverActions.vue';
import ColorPaletteGridItem from '../components/ColorPaletteGridItem.vue';
  export default {
    components: {
    draggable,
    PopoverActions,
    ColorPaletteGridItem
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
        },
        log(e) {
          console.log(e)
        }
    },
}
</script>

<style>
</style>