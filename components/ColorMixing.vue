<template>
  <div class="color-mixing">
      
      <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
        <template v-for="editView in ['scale', 'shade', 'random']">
        <ColorMixingControls
          :key="editView"
          v-if="editView === view"
          :mix-type="editView"
          :palette="palette"
          :steps="steps[editView]"
          @colors="(e) => (selectedColors = e)"
          @steps="(e) => (steps[editView] = e)"
        />
        </template>
      </transition>
    
    <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
      <ColorMixingScale
        v-if="view === 'scale'"
        :palette="palette"
        :steps="steps.scale"
        :colors="selectedColors"
        @selectedColor="(e) => newColor(e)"
      />
    </transition>

    <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
      <ColorMixingShade
        v-if="view === 'shade'"
        :palette="palette"
        :steps="steps.shade"
        :selected-colors="selectedColors"
        @selectedColor="(e) => newColor(e)"
      />
    </transition>

    <transition name="up-fade" :duration="{ enter: 300, leave: 100 }">
      <ColorMixingRandom
        v-if="view === 'random'"
        :palette="palette"
        :steps="steps.random"
        :selected-colors="selectedColors"
        @selectedColor="(e) => newColor(e)"
      />
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import chroma from 'chroma-js';
export default {
  props: {
    paletteId: {
      type: String,
      default: null,
    },
    view: {
      type: String,
      default: 'scale'
    }
  },
  data() {
    return { 
      // view: null, 
      selectedColors: [], 
      steps: {
        scale: 72,
        random: 100,
        shade: 10
      }
    };
  },
  mounted() {
    // this.view = 'scale';
    this.selectedColors = JSON.parse(
      JSON.stringify(
        Array.isArray(this.colors) && !!this.colors?.length
          ? this.colors
          : this.palette?.colors
          ? this.palette.colors
          : []
      )
    );
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
  methods: {
    newColor(color) {
      const newColor = { ...color, value: chroma(color.value).hex() };
      console.log({newColor})
      this.$store.dispatch('addColorToPalette', {
        color: newColor,
        paletteId: this.palette.id,
      });
    },
  },
};
</script>
