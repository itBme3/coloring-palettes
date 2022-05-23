<template>
  <div
    v-if="palette && palette.name"
    class="palette-actions flex"
    :class="{
      'items-center justify-end space-x-1': !isPalettePage,
      'flex-col items-between justify-start space-y-1 pt-2 pb-4':
        isPalettePage,
      '!flex-row': view === 'deleting',
    }"
  >
    <div
      v-if="view === 'deleting'"
      class="ml-auto flex items-center content-end"
    >
      <button
        @click="deletePalette()"
        class="bg-shade-50 text-red-400 hover:bg-red-500 hover:text-white mr-2"
      >
        Delete Palette
      </button>
    </div>
    <div
      v-if="view === 'copying-colors'"
      class="ml-auto flex"
      :class="{
        'flex-col space-y-2': isPalettePage,
        'space-x-2 content-end items-center': !isPalettePage,
      }"
    >
      <label
        class="flex items-center content-start cursor-pointer"
        :class="{
          'order-last ml-3': !isPalettePage,
        }"
      >
        <Icon
          :icon="copyColorsIncludeNames ? 'square-check' : 'square'"
          :class="{
            'text-shade-60': !copyColorsIncludeNames,
            'text-green-400': copyColorsIncludeNames,
          }"
        />
        <input
          class="hidden"
          type="checkbox"
          name="copyColors-names"
          v-model="copyColorsIncludeNames"
        />
        <small class="inline-block text-xs mx-2">include names</small>
      </label>
      <button
        v-for="action in copyColorActions"
        :key="action"
        @click="copyColors(action)"
        class="px-2 py-1 text-sm"
      >
        {{ action }}
      </button>
    </div>

    <small
      v-else-if="view === 'copied'"
      class="rounded text-green-300 bg-shade-30 px-2 py-1 shadow-lg"
    >
      copied 👍
    </small>

    <button
      v-if="view !== null"
      class="bg-transparent"
      :class="{
        'order-first ml-auto !mb-2 !mt-0':
          isPalettePage && ['copying-colors', 'copied'].includes(view),
      }"
      @click="view = null"
    >
      <Icon icon="close" />
    </button>
    <template v-else>
      <TransitionGroup
        v-for="action in activeActions"
        :key="action"
        name="scale-fade"
        tag="div"
      >
        <button
          ref="actionButton"
          v-if="show && !isPalettePage"
          :key="action + '-' + isPalettePage"
          v-tooltip.auto-start="{
            content: action,
            classes: ['rounded', 'bg-shade-20', 'z-90'],
            offset: '5px',
          }"
          class="action-button"
          @click="handleAction(action)"
        >
          <Icon :icon="action" class="m-auto" />
        </button>
        <button
          ref="actionButton"
          v-else-if="show"
          :key="action + '-' + isPalettePage"
          v-tooltip.left="{
            content: isPalettePage ? undefined : action,
            classes: ['rounded', 'bg-shade-20', 'z-90'],
            offset: '5px',
          }"
          class="action-button"
          :class="{
            'text-left': isPalettePage
          }"
          @click="handleAction(action)"
        >
          <Icon :icon="action" :class="{
            'm-auto': !isPalettePage,
            'my-auto ml-2 mr-1': isPalettePage
          }" /> <small class="text-shade-100 ml-0 mr-auto text-xs" v-if="isPalettePage">{{ action }}</small>
        </button>
      </TransitionGroup>
    </template>
  </div>
</template>

<script>
import chroma from 'chroma-js';
export default {
  props: {
    palette: {
      type: Object,
      dafault: () => null,
    },
    actions: {
      type: [Array, String],
      default: 'all',
    },
    show: {
      type: Boolean,
      default: true,
    },

  },
  data() {
    return {
      view: null,
      copyColorActions: ['hex', 'rgba', 'css.rgba', 'hsl', 'css.hsl'],
      copyColorsIncludeNames: false,
    };
  },
  computed: {
    isPalettePage() {
      return !!this.$route.params.palette
    },
    tooltipAttribute() {
      return this.isPalettePage ? 'v-tooltip.left' : 'v-tooltip.auto.state';
    },
    activeActions() {
      const actions = ['rename', 'copyColors', 'duplicate', 'move', 'delete'];
      if (!this.isPalettePage) {
        actions.unshift('edit');
      }
      if (
        !Array.isArray(this.actions) ||
        this.actions.filter(
          (action) => typeof action !== 'string' && action.length !== 0
        ).length === 0
      ) {
        return actions;
      }
      return this.actions.filter(
        (action) => action !== 'edit' || !this.isPalettePage
      );
    },
  },
  methods: {
    deletePalette() {
      const paletteId = `${this.palette.id}`;
      this.view = null;
      if (!this.$route.params.palette) {
        return;
      }

      this.$store.dispatch('deletePalette', paletteId);
      setTimeout(() => {
        this.$router.push(`/`);
      }, 500);
    },
    handleAction(action) {
      switch (action) {
        case 'copyColors':
          this.view = 'copying-colors';
          break;
        case 'edit':
          this.$router.push(`/${this.palette.id}`);
          break;
        case 'duplicate':
          console.log('duplicate');
          break;
        case 'move':
          console.log('move');
          break;
        case 'delete':
          this.view = 'deleting';
          break;
        default:
          break;
      }
      this.$emit(action);
    },
    copyColors(action) {
      const css = action.split('.')[0] === 'css';
      const key = action.replace('css.', '');
      this.$copyText(
        this.palette.colors
          .map((color) =>
            css
              ? this.copyColorsIncludeNames
                ? `${color.name}: ${chroma(color.value).css(key)}`
                : chroma(color.value).css(key)
              : action === 'hex'
              ? this.copyColorsIncludeNames
                ? `${color.name}: ${chroma(color.value)[key]()}`
                : chroma(color.value)[key]()
              : this.copyColorsIncludeNames
              ? `${color.name}: ${JSON.stringify(chroma(color.value)[key]())}`
              : JSON.stringify(chroma(color.value)[key]())
          )
          .join('\n')
      ).then(() => {
        this.view = 'copied';
        setTimeout(() => {
          this.view = null;
        }, 750);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.action-button {
  @apply block whitespace-nowrap w-full mr-0 transform scale-97 hover:scale-100 rounded-md truncate pl-2 text-ellipsis text-shade-100;
}
</style>
