<template>
  <Popover 
    ref="popoverElem"
    class="select-color"
    :classes="{
      heading: 'absolute z-9 right-2 top-2',
      container: 'p-2',
    }"
    @exited="customColor = defaultColor"
    >
    <template slot="trigger">
      <slot name="trigger">
        <button 
          class="add-color color-swatch ml-3 text-base bg-transparent">
          <Icon class="m-auto" icon="add" />
        </button>
      </slot>
    </template>
    <div class="w-full mx-auto flex flex-col py-1">

        <div class="flex"
            :class="{
              'flex-col space-y-1': view === 'default',
              'space-x-1 pr-8': view !== 'default',
            }">

            <button 
              v-for="viewing in ['custom', 'palettes', 'collections']"
              :key="viewing"
              class="button w-full group"
              :class="{
                'w-full': view === 'default',
                'w-10 h-10 p-0': view !== 'default'
              }"
              v-tooltip.top="view === 'default' ? undefined : viewing"
              @click="() => {
                view = viewing;
                viewing === 'palettes' ? palette = null : viewing === 'collections' ? collection = null : ''
                }"
              >
              <Icon class="my-auto mx-0" :icon="viewing" />
              <span 
                v-if="view === 'default'"
                class="my-auto"
                :class="{
                  'ml-2': view === 'default',
                  'hidden': view !== 'default'
                }"
              >{{viewing}}</span>
            </button>
        </div>
      <Transition name="down-fade">
    
          <div v-if="view === 'custom'" class="mx-auto mt-3">
            <ColorPicker
              class="w-full"
              @update="e => {
                if (customColor === defaultColor) {
                  $emit('color', {id: uid(), createdAt: Date.now(), name: e, value: e})
                } else {
                  $emit('update', {id: uid(), createdAt: Date.now(), name: e, value: e})
                }
                customColor = e;
              }" 
            />
          </div>

          <template v-else-if="view === 'palettes'">
            <SelectPalette 
              v-if="!palette"
              swatch-style="simple"
              @select="e => {
                selectedPaletteId = e.id; 
                view = 'palettes'
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
            <div v-else class="select-palette flex flex-col space-y-2 p-2 pt-4">
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
      
      </Transition>
    </div>
  </Popover>
</template>

<script>
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
      },
      defaultColor: {
        type: String,
        default: 'cyan'
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