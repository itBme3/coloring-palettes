<template>
  <div
    class="color-palette-details"
    :class="{
      'is-sidebar': isSidebar,
      collapsed: isSidebar && sidebarCollapsed,
    }"
  >
    <button
      v-if="isSidebar"
      @click="sidebarCollapsed = !sidebarCollapsed"
      class="z-10 relative flex items-center content-center py-2"
      :class="{
        'w-full mb-1 px-0': sidebarCollapsed,
        'ml-auto -right-2 -top-2 float-right': !sidebarCollapsed,
      }"
      v-tooltip.left-start="
        sidebarCollapsed ? { content: 'palette colors', offset: '5px' } : null
      "
    >
      <Icon class="m-auto" :icon="sidebarCollapsed ? 'ellipsis' : 'arrow-right'" />
    </button>
    <transition
      :name="isSidebar ? 'left-fade' : 'down-fade'"
      :duration="{ enter: 500, leave: 100 }"
    >
      <input
        v-if="view.includes('input') && (!sidebarCollapsed || !isSidebar)"
        ref="nameInput"
        class="title relative z-10 mb-3 border-transparent bg-transparent outline-transparent"
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
      <draggable
          v-if="view.includes('colors')"
          v-model="colors"
          tag="div"
          class="color-palette-colors flex flex-col"
          :class="{
            'space-y-2': !isSidebar || !sidebarCollapsed,
            'space-y-px': isSidebar && sidebarCollapsed,
          }"
          style="transition-delay: 0.2s !important"
        >
        <ColorSwatch
          v-for="(color, i) in palette.colors"
          :key="color.id"
          :color="color"
          :delay-show="0"
          :class="{
            'just-added delay-500': Date.now() - color.createdAt < 3000,
          }"
          :swatch-style="isSidebar && sidebarCollapsed ? 'simple' : 'list-item'"
          :clickable="!sidebarCollapsed && isSidebar"
          :actions="true"
          :draggable="true"
          @updateColor="e => $store.dispatch('updateColor', e)"
        />
        <div v-if="sidebarCollapsed && isSidebar"
           class="absolute inset-0 z-9 cursor-pointer"
           @click="sidebarCollapsed = false" />
      </draggable>
    </transition>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import Vue from 'vue'
export default Vue.extend({
  components: {
    draggable
  },
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
      sidebarCollapsed: true,
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
    palette() {
      return (
        this.storedPalettes?.filter((p) => p.id === this.paletteId)[0] || null
      );
    },
    colors: {
      get() {
        return this.palette && this.palette.colors ? this.palette.colors : []
      },
      set(colors) {
        this.$store.dispatch('updatePalette', {palette: {...this.palette, colors}})
      }
    }
  },
  methods: {
    updatePaletteName: debounce(function (e) {
      this.$store.dispatch('updatePalette', {
        palette: { ...this.palette, name: e.target.value },
      });
    }, 100),
    updateColor(color, value) {
      this.$store.commit('updateColor', { ...color, value })
    }
  },
})
</script>
<style lang="scss" scoped>
.is-sidebar {
  @apply bg-shade-35 right-1 transition-all ease-in-out top-1 fixed h-[calc(100vh-0.5rem)] w-[200px] p-4 rounded shadow-lg;
  input.title {
    @apply focus:ring-transparent focus:border-transparent focus:outline-0 ring-offset-transparent #{!important};
  }
  .color-swatch {
    @apply h-8 rounded-sm #{!important};
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
