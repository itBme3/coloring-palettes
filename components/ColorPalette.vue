<template>
  <div
    v-if="palette && palette.name"
    class="color-palette relative inline-block mx-auto w-[calc(100%-2rem)] max-w-6xl"
  >


    <div class="sticky top-0 bg-site-dark z-10 transition-all ease-in-out"
      :class="{
        'pt-4': $store.state.window.scroll.y < 10
      }">
      <PopoverActions 
        :item="palette"
        :input-el="$refs.nameInput"
        text-color="rgba(240,240,240)"
        :collapsed-actions="!!$store.state.window.size.isMobile"
        class="ml-auto float-right mr-0 relative -bottom-1"
      />
      <div class="toggle-buttons flex items-center content-start space-x-2 mb-0 relative px-4">
            <button
              v-for="editView in ['palette', 'mixing']"
              :key="editView"
              @click="toggleView(editView)"
              class="w-auto py-1 flex-shrink px-2 tracking-widest rounded-md uppercase font-black text-lg relative border-[2px] bg-site-dark "
              :class="{
                'order-first': editView === 'palette',
                'text-shade-250 cursor-default hover:scale-100 rounded-b-none py-3 px-2 bottom-[-3px] border-shade-40 border-b-0 hover:bg-site-dark': view === editView,
                'text-shade-120 hover:text-shade-250 hover:bg-shade-30 border-transparent scale-95': view !== editView
              }"
            >
              {{ editView }}
            </button>
        </div>
        <div class="rounded-lg border-[2px] border-b-0 px-2 pt-2 border-shade-40 min-h-[6px] rounded-b-none">
           <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
              <input
                v-if="view === 'palette'"
                ref="nameInput"
                class="title text-2xl relative z-10 mx-4 focus-visible:my-4 w-[calc(100%-2rem)] border-transparent bg-transparent outline-transparent max-w-full hover:scale-100 focus-visible:scale-100 hover:shade-40 focus-visible:ring-shade-40 focus-visible:bg-shade-30"
                type="text"
                name="name-input"
                :value="palette.name"
                @input="updatePaletteName"
              />
              <div v-else-if="view === 'mixing'" 
                class="flex content-start items-center space-x-1 pl-2 pb-1 transition-all ease-in-out"
                :class="{
                  'pt-4': $store.state.window.scroll.y < 20
                }">
                  <button
                  v-for="mixView in ['scale', 'shade', 'random']"
                    :key="mixView"
                    class="hover:bg-white scale-95 hover:text-shade-20 hover:border-white text-sm outline w-auto py-1 px-2"
                    :disabled="mixView === mixingView"
                    :class="{
                      'active': mixView === mixingView,
                    }"
                    @click="mixingView = mixView"
                  >
                    {{ mixView }}
                  </button>
              </div>
            </transition>
        </div>
    </div>


    
    <div class="w-full rounded-lg p-4 pt-1 shadow-xl shadow-black border-[2px] border-t-0 rounded-t-none border-shade-40">
      <ColorPaletteDetails
        v-if="view === 'palette'"
        ref="paletteDetails"
        :palette-id="palette.id"
        class="px-4 pb-5"
      />
      <ColorMixing
        v-if="view === 'mixing'"
        :palette-id="palette.id"
        :view="mixingView"
        style="width: calc(100% - 2rem)"
      />
      
      <transition name="left-fade">
        <ColorPaletteDetails
          v-if="view === 'mixing'"
          ref="paletteDetailsSidebar"
          class="is-sidebar"
          :palette-id="palette.id"
          :is-sidebar="true"
          @sidebarToggle="setSidebarDetailsWidth()"
        />
      </transition>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash';
import { mapGetters } from 'vuex';
export default {
  props: {
    paletteId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      view: null,
      mixingView: null,
      sidebarDetailsWidth: this.$refs?.paletteDetailsSidebar?.$el?.offsetWidth || 0,
    };
  },
  mounted() {
    this.view = this.$route.hash === '#mixing' ? 'mixing' : 'palette'
    this.mixingView = 'scale'
  },
  computed: {
    ...mapGetters({
      storedPalettes: 'storedPalettes',
    }),
    palette() {
      return (
        this.storedPalettes?.filter((p) => [p.id, p.handle].includes(this.paletteId))[0] || null
      );
    },
  },
  watch: {
    paletteId(val) {
      this.palette =
        this.storedPalettes?.filter((p) => p.id === val)[0] || null;
    },
    view(val) {
      setTimeout(() => {
        this.setSidebarDetailsWidth();
      }, 500)
      // if(window.location.hash.length > 1) {
      //   window.location.hash = val
      // }
    },
  },
  methods: {
    setSidebarDetailsWidth(count = 0) {
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          this.sidebarDetailsWidth =
            this.$refs?.paletteDetailsSidebar?.$el?.offsetWidth || 0;
        }, i * 100);
      }
    },
    focusInput() {
      try {
        this.$refs.paletteDetails.$refs.nameInput.select();
      } catch {}
    },
    updatePaletteName: debounce(function (e) {
      this.$store.dispatch('updatePalette', {
        palette: { ...this.palette, name: e.target.value },
      });
    }, 250),
    toggleView(view) {
      this.view = view; 
      window.location.hash = view
    }
  },
};
</script>

<style lang="scss">
.color-palette {
  @apply max-w-4xl mx-auto;
}
</style>
