<template>
  <div class="select-color max-w-[280px]">
    <div class="flex"
      :class="{
        'flex-col space-y-1': view === 'default',
        'space-x-1': view !== 'default',
      }">

      <button 
        v-for="viewing in ['custom', 'palettes', 'collections']"
        :key="viewing"
        class="button w-full group"
         @click="() => {
           view = viewing;
           viewing === 'palettes' ? palette = null : viewing === 'collections' ? collection = null : ''
          }"
         :class="{
          'w-full': view === 'default',
          'w-auto': view !== 'default'
        }">
        <Icon class="my-auto mx-0" :icon="viewing" />
        <span class="my-auto"
          :class="{
            'ml-2': view === 'default',
            'hidden group-hover:inline-block': view !== 'default'
          }"
        >{{viewing}}</span>
      </button>
    </div>
    <div class="w-full"></div>

    <div v-if="view === 'custom'" class="max-w-[200px] mx-auto mt-3">
      <ColorPicker @update="e => customColor = e" class="w-full" />
      <button class="button bg-gray-800 bg-opacity-50 hover:bg-opacity-100 mt-2"
        @click="$emit('color', {id: uid(), createdAt: Date.now(), name: customColor, name: customColor})">select</button>
    </div>

    <template v-else-if="view === 'palettes'">
      <SelectPalette 
        v-if="!palette"
        swatch-style="simple"
        @select="e => {
          selectedPaletteId = e.id; 
          view= 'palettes'
        }"
        @color="e => $emit('color', e)" />
      <ColorPaletteGridItem
        v-else
        :palette-id="selectedPaletteId"
        :link="false"
        :actions="false"
        swatch-style="simple"
        :swatch-clickable="true"
        @color="e => $emit('color', e)"
        class="mt-6"
      />
    </template>
    <template v-if="view === 'collections'">
      <SelectCollection 
        v-if="!collection"
        @select="e => {selectedCollectionId = e.id; view= 'collections'}" />
      <div v-else class="select-palette flex flex-col space-y-2">
        <ColorPaletteGridItem
          v-for="palette in collection.palettes"
          :key="palette"
          :palette-id="palette"
          :link="false"
          :actions="false"
          swatch-style="simple"
          :swatch-clickable="true"
          @click="e => {
            selectedPaletteId = palette;
            view = 'palettes'
          }"
          @color="e => $emit('color', e)"
          class="mt-6 border-0"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid';
  export default Vue.extend({
    props: {
      paletteId: {
        type: String,
        default: null
      },
      collectionId: {
        type: String,
        default: null
      },
      custom: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        customColor: 'cyan',
        selectedPaletteId: this.paletteId,
        selectedCollectionId: this.collectionId,
        view: this.custom 
          ? 'custom'
          : this.paletteId
            ? 'palette'
            : this.collectionId 
              ? 'collection'
              : 'default'
      }
    },
    computed: {
      ...mapGetters({
        palettes: 'storedPalettes',
        collections: 'storedCollections'
      }),
      palette: {
        get(){
          return this.palettes.filter(p => p.id === this.selectedPaletteId)[0] || null
        },
        set(id) {
          this.selectedPaletteId = id
        }
      },
      collection: {
        get() {
          return this.collections.filter(p => p.id === this.selectedCollectionId)[0] || null
        },
        set(id) {
          this.selectedCollectionId = id
        }
      }
    },
    methods: {
      uid: uuidv4,
      log(e) {
        console.log(e)
      }
    }
  })
</script>

<style lang="scss">
.select-color {
  .input-search {
    @apply my-6;
  }
  .grid-item {
    @apply border-transparent hover:bg-opacity-0 p-0 mb-2 shadow-none cursor-default;
    @apply scale-100 hover:scale-100 #{!important};
    .grid-item-title {
      @apply mb-3 opacity-50;
    }
  }
  .select-palette, .select-collection {
    .grid-item {
      @apply border-shade-40 p-4 hover:bg-opacity-20 shadow-lg cursor-pointer;
    }
  }
}
</style>