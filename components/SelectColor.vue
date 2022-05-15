<template>
  <Popover 
    ref="popoverEl"
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
          class="add-color color-swatch text-base bg-transparent">
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
              v-for="viewing in ['custom', 'palettes']"
              :key="viewing"
              class="button w-full group"
              :class="{
                'w-full': view === 'default',
                'w-10 h-10 p-0': view !== 'default'
              }"
              v-tooltip.top="view === 'default' ? undefined : viewing"
              @click="() => {
                view = viewing;
                viewing === 'palettes' ? palette = null : ''
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
                  emitSelection({id: uid(), createdAt: Date.now(), name: e, value: e})
                } else {
                  emitSelection({id: uid(), createdAt: Date.now(), name: e, value: e}, 'update')
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
              @color="e => emitSelection(e)" />
            <ColorPaletteGridItem
              v-else
              :palette-id="palette.id"
              :link="false"
              :actions="false"
              swatch-style="simple"
              item-style="wrap-colors"
              :swatch-clickable="true"
              @color="e => emitSelection(e)"
              class="mt-6 hover:scale-100 border-0 p-2 hover:bg-transparent"
            />
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
        view: this.custom 
          ? 'custom'
          : this.paletteId
            ? 'palettes'
              : 'default'
      }
    },
    computed: {
      ...mapGetters({
        palettes: 'storedPalettes',
      }),
      palette: {
        get(){
          return this.palettes.filter(p => p.id === this.selectedPaletteId)[0] || null
        },
        set(id) {
          this.selectedPaletteId = id
        }
      }

    },
    methods: {
      uid: uuidv4,
      log(e) {
        console.log(e)
      },
      emitSelection(e, name = 'color') {
        if(this.view === 'custom') {
          return this.$emit(name, e)
        }
        this.$refs.popoverEl.hide()
          .then(() => this.$emit(name, e))
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
  .select-palette {
    .grid-item {
      @apply border-shade-40 p-4 hover:bg-opacity-20 shadow-lg cursor-pointer;
    }
  }
}
</style>