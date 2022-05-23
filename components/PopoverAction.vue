<template>
  <Popover 
    ref="popover"
    :classes="classes"
    :max-width="maxWidth"
    :close-on-click="closeOnClick && !['copy-colors'].includes(action)">
    <template #trigger><span class="hidden">open {{action}}</span></template>
    
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
        @update="(e) => handleAction({ ...item, value: e })"
      />
    </template>

    <template v-else-if="action === 'delete'">
      <slot><h4 class="text-center pt-4 pb-5 px-5">Confirm</h4></slot>
      <slot name="actions">
        <button
          class="bg-red-500 hover:bg-red-400 text-red-900 w-full"
          @click="handleAction">Delete</button>
      </slot>
    </template>

    <template v-else-if="action === 'duplicate'">
      <Loading v-if="!duplicatedItem" class="mx-auto my-6" />
      <template v-else>
        <h4 class="text-center pt-4 pb-5 px-5">Palette Duplicated 👍</h4>
          <button
            class="bg-shade-20 hover:bg-shade-30 text-green-400 w-full"
            @click="$router.push(`/${duplicatedItem.id}`)">Go To Palette</button>
      </template>
    </template>
    
    <template v-else-if="action === 'copy-colors'">
      <div
      v-if="!view"
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
        @click="(e) => {
          e.stopPropagation();
          copyColors(action)
          }"
        class="px-2 py-1 text-sm"
      >
        {{ action.split('-').join(' ') }}
      </button>
    </div>

    <small
      v-else-if="view === 'copied'"
      class="rounded text-green-300 bg-shade-30 px-2 py-1 shadow-lg"
    >
      copied 👍
    </small>
    </template>
    
    <template v-else-if="action === 'move'">
      <SelectPalette
        @select="e => handleAction(!!e && !!e.id ? e.id : null)"
      />
    </template>

  </Popover>
</template>

<script>
import {capitalize, asyncDelay} from '~/utils/funcs'
import chroma from 'chroma-js'
  export default {
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
      inputEl: {
        type: HTMLElement,
        default: () => null
      },
      closeOnClick: {
        type: Boolean,
        default: false
      },
      maxWidth: {
        type: String,
        default: '320px'
      }
    },
    data: () => ({
      view: null,
      copyColorsIncludeNames: false,
      copyColorActions: ['hex', 'rgba', 'css.rgba', 'hsl', 'css.hsl'],
      duplicatedItem: null
    }),
    watch: {
      '$route.path'() {
        console.log('path changed')
        this.showing = false
        this.hide()
      },
    },
    computed: {
      isPalettePage() {
        return !!this.$route.params.palette
      },
      itemType () {
        return Object.keys(this.item).includes('colors')
          ? 'palette'
          : Object.keys(this.item).includes('value')
          ? 'color'
          : null
      },
      itemTypeExists() {
        return ['palette', 'color'].includes(this.itemType)
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
          if (this.action === 'duplicate') {
              this.$store.dispatch(`duplicate${capitalize(this.itemType)}`, this.item) 
                .then(res => this.duplicatedItem = res);
                if(this.itemType === 'color') {
                  return
                }
          }
          this.$refs.popover.show()
        } catch {}
      },
      hide() {
        try {
          this.$refs.popover.hide()
          this.view = null
          return this.view
        } catch {}
      },
      async handleAction(props = {}) {
        if(!this.itemTypeExists) { return }
        const params = {
          [this.itemType]: ['color'].includes(this.action) ? props : this.item
        }
        const parentId = !!props ? typeof props === 'string' ? props : !!props.id ? props.id : null : null;
        if(typeof parentId === 'string') {
          params['paletteId'] = parentId
        }
        if (this.closeOnClick && !['copy-colors', 'color'].includes(this.action)) {
          await this.hide();
        }
        switch (this.action) {
          case 'delete':
            asyncDelay(400).then(() => this.$store.dispatch(`delete${capitalize(this.itemType)}`, this.item))
            break;
          case 'duplicate':
            this.$store.dispatch(`duplicate${capitalize(this.itemType)}`, params)
            break;
          case 'move':
              this.$store.dispatch(`move${capitalize(this.itemType)}`, params)
            break;
          case 'copy-colors':
            this.copyColors(props)
            break;
          case 'rename':
            if (this.inputEl && this.inputEl.select) {
              this.inputEl.select()
            } else {
              this.$store.dispatch(`update${capitalize(this.itemType)}`, { ...this.item, name: props })
            }
            break;
          case 'color':
            this.$store.dispatch('updateColor', props)
            break;
          default:
            break;
        }

        if (this.closeOnClick) {
          this.hide();
        }
        this.$emit(this.action, params)
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
          return asyncDelay(750)
            .then(() => {
              this.hide()
              this.view = null
            })
        });
      }
    }
  }
</script>

<style scoped>

</style>