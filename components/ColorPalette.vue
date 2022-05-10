<template>
  <div
    v-if="palette && palette.name"
    class="color-palette ml-2 mr-auto w-full relative inline-block"
  >
    <aside ref="paletteNav" class="sticky float-left top-2 w-[160px] rounded-md border border-shade-30 p-4">
      <div class="toggle-buttons flex flex-col space-y-2 mb-6 relative z-9">
          <button
            v-for="editView in ['palette', 'mixing']"
            :key="editView"
            @click="view = editView"
            class="hover:text-white tracking-widest uppercase font-black border-2 border-t-0 border-x-0 border-transparent text-lg text-shade-180 bg-shade-20 bg-opacity-40"
            :class="{
              'order-first': editView === 'palette',
              'border-white text-white rounded-b-none text-2xl bg-transparent cursor-default hover:bg-transparent hover:scale-100': view === editView,
            }"
          >
            {{ editView }}
          </button>
          <ColorPaletteActions
            v-if="view === 'palette'"
            class="order-first"
            :palette="palette"
            @rename="focusInput"
          />
      </div>
      <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
        <div v-if="view === 'mixing'" class="flex flex-col space-y-2" >
            <button
            v-for="mixView in ['scale', 'shade', 'random']"
              :key="mixView"
              class="hover:bg-white hover:text-shade-20 text-sm outline w-full"
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
    </aside>

    <div class="ml-auto" :style="{
          width: $refs.paletteNav && $refs.paletteNav.offsetWidth
            ? 'calc(100% - ' + ($refs.paletteNav.offsetWidth) + 'px - 2rem)'
            : 'calc(100% - 2rem)',
        }">
      <ColorPaletteDetails
        v-if="view === 'palette'"
        ref="paletteDetails"
        :palette-id="palette.id"
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
    this.view = 'mixing';
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
    palettedId(val) {
      this.palette =
        this.storedPalettes?.filter((p) => p.id === val)[0] || null;
    },
    view() {
      this.setSidebarDetailsWidth();
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
  },
};
</script>

<style lang="scss">
.color-palette {
  @apply max-w-4xl mx-auto;
}
</style>
