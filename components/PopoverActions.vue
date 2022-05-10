<template>
  <Popover ref="popover"
    :classes="classes">

    <template v-if="action === 'rename'">
      <input 
        ref="nameInput"
        v-model="itemName"
      />
    </template>

    <template v-else-if="action === 'color'">
      <ColorPicker
        picker-type="spectrum"
        :value="item.value"
        @update="(e) => $store.dispatch('updateColor', { ...item, value: e })"
      />
    </template>

    <template v-else-if="action === 'delete'">
      <slot><h4 class="text-center pt-4 pb-5 px-5">Confirm</h4></slot>
      <slot name="actions">
        <button
          class="bg-red-500 hover:bg-red-400 text-red-900"
          @click="handleAction">Delete</button>
      </slot>
    </template>
    
    <template v-else-if="action === 'copy'">
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
          name="copy-colors-names"
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
      class="rounded text-green-300 bg-shade-40 px-2 py-1 shadow-lg"
    >
      copied 👍
    </small>
    </template>

  </Popover>
</template>

<script>
  import Vue from 'vue'
import {capitalize} from '~/utils/funcs'
  export default Vue.extend({
    props: {
      item: {
        type: Object,
        default: () => {}
      },
      action: {
        type: String,
        default: ''
      },
      classes: {
        type: Object,
        default: () => ({
          container: '',
          close: '',
          heading: '',
          body: '',
          actions: '',
        })
      },
    },
    data: () => ({
      view: null
    }),
    computed: {
      isPalettePage() {
        return (
          (this.$route.path.split('/')[1] === 'palettes' &&
            this.$route.params.id) ||
          !!this.$route.params.palette
        );
      },
      itemType () {
        return Object.keys(item).includes('palettes')
          ? 'collection'
          : Object.keys(item).includes('colors')
          ? 'palette'
          : Object.keys(item).length === 2 && Object.keys(item).includes('value')
          ? 'color'
          : null
      },
      itemTypeExists() {
        return ['collection','palette', 'color'].includes(this.itemType)
      },
      itemName: {
        get() {
          return this.item?.name?.length ? this.item.name : this.item?.value?.length ? this.item.value : ''
        },
        set(name) {
          if(!this.itemTypeExists) {return}
          const actionName = `update${capitalize(this.itemType)}`;
          this.$store.dispatch(actionName, {...this.item, name });
        }
      }
    },
    methods: {
      show() {
        try {
          this.$refs.popover.show()
        } catch {}
      },
      hide() {
        try {
          this.$refs.popover.hide()
        } catch {}
      },
      copyColors(action) {
        const css = action.split('.')[0] === 'css';
        const key = action.replace('css.', '');
        this.$copyText(
          (this.itemType === 'palette' ? this.item.colors : this.itemType === 'color' ? [this.item] : [])
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
          return this.asyncDelay(750)
            .then(() => this.view = null)
        });
      },
      handleAction(props = {}) {
        if(!this.itemTypeExists) { return }
        switch (this.action) {
          case 'delete':
            this.$store.dispatch(`delete${capitalize(this.itemType)}`)
            break;
          case 'duplicate':
            this.$store.dispatch(`duplicate${capitalize(this.itemType)}`)
            break;
          case 'move':
            if(this.itemType === 'collection') {return};
            this.$store.dispatch(`move${capitalize(this.itemType)}`)
            break;
          case 'copy-colors':
            this.copyColors(props)
            break;
          default:
            break;
        }
      }
    }
  })
</script>

<style scoped>

</style>