<template>
  <div 
    class="create-new-palette flex flex-col">
    <button
      v-if="name === null"
      @click="name === null ? createNewPalette() : resetNewPalette()"
      class="py-6 px-12 mr-auto !border-2 !border-dashed border-shade-50 bg-transparent hover:shadow-xl shadow transform scale-100 hover:scale-105 mb-4"
      v-tooltip.right="{ content: name === null ? 'Create New Palette' : 'Cancel', offset: '10' }"
    >
      <Icon icon="add" class="h-18 m-auto" /> Palette
    </button>
    <template v-else>
      <button 
        class="p-1 px-2 rounded-md bg-transparent hover:bg-red-400 hover:text-red-900 w-auto ml-auto mr-0 -mt-2"
        @click="resetNewPalette()">
        <Icon icon="close" class="h-18 m-auto" />
      </button>
      <div class="p-4 rounded-lg bg-shade-30 mb-8 flex flex-col">
        <label for="new-palette-name" class="text-sm">Palette Name:</label>
        <input
        id="new-palette-name"
          class="palette-title grid-item-title border border-shade-50 relative mt-2 z-10 bg-transparent hover:bg-shade-50 bg-opacity-10 pl-2 mb-2 focus-visible:bg-shade-50"
          ref="paletteNameInput"
          tabindex="1"
          v-model="name"
        />
        <div v-if="colors.length" class="colors flex flex-nowrap space-x-px mt-4">
          <ColorSwatch
            v-for="(color, i) in colors"
            :key="color + '-' + i"
            :color="color"
            :delay-show="i * 50"
            class="group"
            :actions="['color']"
            :clickable="true"
          />
        </div>
        <SelectColor
          class="mb-6 mt-2"
          @color="e => colors.push(e)"
          @update="e => {
            colors.pop()
             colors.push(e)
          }"
          :custom="true"
        >
          <template #trigger>
            <button 
              class="bg-shade-60 bg-opacity-30 hover:bg-opacity-100 text-sm focus-visible:border focus-visible:border-shade-100 focus-visible:hover:border-transparent"
              tabindex="2">
              <Icon class="m-auto" icon="add" /> Colors
            </button>
          </template>
        </SelectColor>
        <button 
          class="button text-green-400 bg-shade-60 bg-opacity-50 hover:bg-opacity-100 disabled:hover:bg-opacity-50 mr-auto disabled:cursor-not-allowed disabled:opacity-40" :disabled="!(colors.length > 0 && name.length > 0)"
          @click="create()">
          Create Palette
        </button>
      </div>
    </template>
  </div>
</template>
<script>
import { v4 as uuid } from 'uuid';
export default {
  data() {
    return {
      name: null,
      colors: [],
      id: null,
      handle: null
    }
  },
  mounted() {
    document.addEventListener('keyup', this.keyup, {passive: true})
  },
  beforeUnmount() {
    document.removeEventListener('keyup', this.keyup)
  },
  methods: {
    keyup(e) {
      if(this.name === null) { return }
      if (e.keyCode === 27) {
        this.resetNewPalette();
        e.stopPropagation();
      }
      if(e.key === 'Enter' && this.colors.length && this.name?.length) {
        this.create()
        e.stopPropagation();
      }
    },
    createNewPalette() {
      this.name = '';
      const id = uuid();
      this.id = id;
      this.handle = id;
      this.colors = [];
      setTimeout(() => this.$refs.paletteNameInput.select(), 500)
    },
    resetNewPalette() {
      this.name = null;
      this.colors = [];
      this.handle = null;
      this.id = null
    },
    create() {
      if(!this.name?.length || !this.colors?.length) {return}
      const { name, id, handle, colors } = this;
      this.$store.commit('newPalette', { name, id, handle, colors });
      this.resetNewPalette()
    }
  }
}
</script>