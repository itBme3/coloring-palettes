<template>
  <div
    v-if="palette && palette.name"
    class="color-palette mx-auto w-full relative"
  >
    <pre>{{ sidebarWidth }}</pre>
    <div class="toggle-buttons flex space-x-2 my-3 relative z-9">
      <button
        v-for="editView in ['palette', 'mixing']"
        :key="editView"
        @click="view = editView"
        class="hover:bg-white hover:text-shade-20"
        :class="{
          'bg-white text-shade-20': editView === view,
        }"
      >
        {{ editView }}
      </button>
    </div>
    <ColorPaletteDetails
      v-if="view === 'palette'"
      ref="paletteDetails"
      :palette="palette"
    />
    <ColorMixing
      v-if="view === 'mixing'"
      :palette-id="palette.id"
      :style="{
        width: 'calc(100% - ' + sidebarWidth + 'px)',
      }"
    />
    <ColorPaletteActions
      v-if="view === 'palette'"
      :palette="palette"
      @rename="focusInput"
    />
    <transition name="left-fade">
      <ColorPaletteDetails
        v-if="view === 'mixing'"
        ref="paletteDetailsSidebar"
        class="is-sidebar"
        :palette="palette"
        :is-sidebar="true"
        @sidebarToggle="setSidebarWidth()"
      />
    </transition>
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
      sidebarWidth: this.$refs?.paletteDetailsSidebar?.$el?.offsetWidth || 0,
    };
  },
  mounted() {
    this.view = 'mixing';
  },
  computed: {
    ...mapGetters({
      storedPalettes: 'storedPalettes',
    }),
    palette() {
      return (
        this.storedPalettes?.filter((p) => p.id === this.paletteId)[0] || null
      );
    },
  },
  watch: {
    palettedId(val) {
      this.palette =
        this.storedPalettes?.filter((p) => p.id === val)[0] || null;
    },
    view() {
      this.setSidebarWidth();
    },
  },
  methods: {
    setSidebarWidth() {
      setTimeout(() => {
        this.sidebarWidth =
          this.$refs?.paletteDetailsSidebar?.$el?.offsetWidth || 0;
      }, 100);
    },
    focusInput() {
      try {
        this.$refs.paletteDetails.$refs.nameInput.select();
      } catch {}
    },
    updatePaletteName: debounce(function (e) {
      this.$store.dispatch('localStorage/updatePalette', {
        palette: { ...this.palette, name: e.target.value },
      });
    }, 250),
  },
};
</script>
