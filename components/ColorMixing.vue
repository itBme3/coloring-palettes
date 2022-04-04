<template>
  <div class="color-mixing">
    <div class="toggle-buttons space-x-2">
      <button
        v-for="editView in ['scale', 'shade', 'random']"
        :key="editView"
        class="hover:bg-white hover:text-shade-20 text-sm"
        :class="{
          'bg-white text-shade-20': editView === view,
        }"
        @click="view = editView"
      >
        {{ editView }}
      </button>
    </div>

    <ColorMixingScale v-if="view === 'scale'" :palette="palette" />
  

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    paletteId: {
      type: String,
      default: null,
    },
  },
  data() {
    return { view: 'scale' };
  },
  computed: {
    ...mapGetters({
      storedPalettes: 'storedPalettes',
    }),
    palette() {
      return (
        this.storedPalettes.filter((p) => p.id === this.paletteId)[0] || null
      );
    },
  },
};
</script>
