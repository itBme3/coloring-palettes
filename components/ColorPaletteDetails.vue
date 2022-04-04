<template>
  <div
    class="color-palette-details"
    :class="{
      'is-sidebar': isSidebar,
      collapsed: isSidebar && sidebarCollapsed,
    }"
  >
    {{ newColors }}
    <button
      v-if="isSidebar"
      @click="sidebarCollapsed = !sidebarCollapsed"
      :class="{
        'w-full mb-1 py-2': sidebarCollapsed,
        'ml-auto pt-1 relative -right-2 -top-2 float-right': !sidebarCollapsed,
      }"
      v-tooltip.left="sidebarCollapsed ? 'palette colors' : null"
    >
      <Icon :icon="sidebarCollapsed ? 'ellipsis' : 'arrow-right'" />
    </button>
    <transition
      :name="isSidebar ? 'left-fade' : 'down-fade'"
      :duration="{ enter: 500, leave: 100 }"
    >
      <input
        v-if="view.includes('input')"
        ref="nameInput"
        class="title relative z-10 mb-3 border-transparent outline-transparent"
        :class="{
          'text-4xl': !isSidebar,
          'text-sm rounded-none border-l-0 border-r-0 border-t-0 !border-shade-20 border-1 bg-transparent hover:border-20 !focus:border-20 !hover:bg-shade-20 !focus:bg-shade-20 hover:rounded focus:rounded pl-0 focus:pl-2 hover:pl-2':
            isSidebar,
        }"
        type="text"
        :value="palette.name"
        @input="updatePaletteName"
      />
    </transition>
    <transition name="up-fade" :duration="{ enter: 500, leave: 100 }">
      <div
        v-if="view.includes('colors')"
        class="color-palette-colors flex flex-col"
        :class="{
          'space-y-2': !isSidebar || !sidebarCollapsed,
          'space-y-px': isSidebar && sidebarCollapsed,
        }"
        style="transition-delay: 0.2s !important"
      >
        <ColorSwatch
          v-for="(color, i) in palette.colors"
          :key="color.value + i"
          :color="color"
          :delay-show="i * 100"
          :class="{
            'just-added delay-500': Date.now() - color.createdAt < 3000,
          }"
          :swatch-style="isSidebar && sidebarCollapsed ? 'simple' : 'list-item'"
          :clickable="!sidebarCollapsed || !isSidebar"
        />
      </div>
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
    isSidebar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      view: [],
      sidebarCollapsed: false,
    };
  },
  mounted() {
    this.view.push('input');
    setTimeout(() => {
      this.view.push('colors');
    }, 200);
  },
  watch: {
    sidebarCollapsed(collapsed) {
      if (collapsed && this.view.includes('input')) {
        this.view = this.view.filter((key) => key !== 'input');
      }
      if (!collapsed && !this.view.includes('input')) {
        this.view.push('input');
      }
      this.$emit('sidebarToggle');
    },
  },
  computed: {
    ...mapGetters({
      storedPalettes: 'storedPalettes',
    }),
    newColors() {
      return this.$store.state?.localStorage?.addedColors || [];
    },
    palette() {
      return (
        this.storedPalettes?.filter((p) => p.id === this.paletteId)[0] || null
      );
    },
  },
  methods: {
    updatePaletteName: debounce(function (e) {
      this.$store.dispatch('localStorage/updatePalette', {
        palette: { ...this.palette, name: e.target.value },
      });
    }, 100),
  },
};
</script>
<style lang="scss" scoped>
.is-sidebar {
  @apply bg-shade-35 right-1 transition-all ease-in-out top-1 fixed h-[calc(100vh-0.5rem)] w-[200px] p-4 rounded shadow-lg;
  input.title {
    @apply focus:ring-transparent focus:border-transparent focus:outline-0 ring-offset-transparent #{!important};
  }
  &.collapsed {
    @apply w-10 right-0 top-0 p-1;
    .colors,
    .color-swatch {
      @apply w-full h-4 #{!important};
    }
  }
}
</style>
