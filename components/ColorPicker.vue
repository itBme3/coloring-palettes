<template>
  <client-only>
    <component
      :class="{ 'color-picker': true, [pickerType]: pickerType === 'spectrum' }"
      v-model="pickerValue"
      :palette="colors"
      :preset-colors="colors"
      :colors="colors"
      :is="
        pickerType === 'spectrum'
          ? 'sketch'
          : pickerTypes.includes(pickerType.toLowerCase())
          ? pickerType
          : 'sketch'
      "
    />
  </client-only>
</template>

<script>
import { Slider, Compact, Sketch, Twitter } from 'vue-color';
import chroma from 'chroma-js';
const defaultColor = chroma.random().hex();

export default {
  components: {
    slider: Slider,
    sketch: Sketch,
    twitter: Twitter,
  },
  props: {
    value: {
      type: String,
      default: defaultColor,
    },
    pickerType: {
      type: String,
      default: 'sketch',
    },
    colors: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    pickerValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update', val.hex);
      },
    },
  },
  data() {
    return {
      pickerTypes: ['sketch', 'spectrum', 'compact', 'slider'],
      // pickerValue: ''
    };
  },
};
</script>
