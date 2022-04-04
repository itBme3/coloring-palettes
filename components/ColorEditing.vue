<template>
  <div class="color-editing" style="width: 100%">
    <section
      :style="{
        width:
          $refs && $refs.colorControls
            ? 'calc(100% - ' + controlsWidth + ')'
            : 'calc(100% - 2rem)' + ')',
      }"
    >
      <div
        class="toggle-view"
        style="display: flex; flex-wrap: wrap; padding: 0.5rem 0.5rem 1rem"
      >
        <button
          v-for="editView in views"
          :key="editView"
          @click="view = editView"
          :class="{ ['active']: view === editView }"
          style="margin-right: 0.3rem"
        >
          {{ editView }}
        </button>
      </div>

      <div style="display: flex; flex-wrap: wrap">
        <template v-if="view === 'shade'">
          <ColorEditingShade :steps="steps" />
        </template>
        <template v-else-if="view === 'scale'">
          <ColorEditingScale :steps="steps" />
        </template>
      </div>
    </section>

    <!-- <ColorEditingControls
      ref="colorControls"
      :colors="inputColors"
      :steps="steps"
      swatch-style="list"
      @colors="(e) => (inputColors = e)"
      @steps="(e) => (steps = e)"
      style="position: fixed; right: 0; top: 0; bottom: 0; overflow-y: scroll"
    /> -->
  </div>
</template>

<script>
import chroma from 'chroma-js';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      pickerValue: chroma.random().hex(),
      view: 'scale',
      views: ['scale', 'shade', 'merge'],
      steps: 60,
      testColor: 'cyan',
    };
  },

  mounted() {
    console.log(this.$refs);
    // this.results = chroma.scale(['white', 'black']).domain([0,100]);
    // this.colors = chroma.scale(this.inputColors).colors(200);
    // .slice(3, 20 - 3);
    // this.colors = chroma
    //   .scale(['black', 'red', 'yellow', 'white'])
    //   .correctLightness()
    //   // .cache(false)
    //   .colors(20);
  },

  computed: {
    ...mapGetters({
      inputColors: 'localStorage/editingSelectedColors',
    }),
    controlsWidth() {
      return this.$refs?.editingControls?._vnode?.elm?.offsetWidth || '200px';
    },
  },
};
</script>

<style lang="scss">
.color-editing {
  .selected-colors {
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  .color-swatch {
    margin: 0.25rem;
  }
}
</style>
