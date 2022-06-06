<template>
<client-only>
<div 
  v-if="item"
  ref="popoverActions"
  class="popover-actions"
  @click="e => {
    $store.commit('window/setClick', e)
    e.stopPropagation()
  }">
  <component
    :is="collapsedActions ? 'Popover' : 'div'"
    :close-on-click="true">
    <template #trigger v-if="collapsedActions">
      <button 
        class="menu-toggle"
        :style="{color: textColor }">
        <Icon 
          class="m-auto"
          :icon="collapseIcon"
          :style="{
            color: textColor
          }"
        />
      </button>
    </template>

    <div 
      class="toggle-actions flex mr-2"
      key="toggleActions"
      :class="{
        'flex-col content-start items-stretch space-y-1 mx-0': collapsedActions,
        'flex-row content-end items-center space-x-1 ml-auto mr-0': !collapsedActions,
      }">
        <button
          v-for="action in activeActions"
          v-tooltip="!collapsedActions ? {content: action, placement: 'top' } : undefined"
          class="icon-button toggle-action-button items-center flex group"
          :class="{
            'content-center': !collapsedActions,
            'content-end py-2 w-full': collapsedActions,
          }"
          @click="(e) => handleAction(action)"
        >
          <small
            class="text-xs text-shade-200 font-normal mr-auto pr-2"
            :class="{
              'tooltip': !collapsedActions,
            }">{{action.split('-').join(' ')}}</small>
          <Icon
            class="opacity-50 group-hover:opacity-100"
            :icon="action === 'copy-colors' ? 'copy' : action "
          />
        </button>
    </div>
  </component>
  <PopoverAction
    v-for="action in activeActions" 
    :key="action"
    :ref="action + 'Popover'"
    :item="item"
    :action="action"
    :input-el="$refs.nameInput"
    :close-on-click="['delete', 'duplicate', 'copy-colors'].includes(action)"
    :text-color="textColor"
    :max-width="action === 'move' ? '500px' : '300px' "
    @color="(e) => action === 'color' ? $emit('color', e) : ''"
    />
</div>
</client-only>

</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        default: () => {}
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
      animationName: {
          type: String,
          default: "scale-fade",
      },
      textColor: {
        type: String,
        default: '#000000'
      },
      collapseIcon: {
        type: String,
        default: 'ellipsis'
      },
      collapsedActions: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      view: null
    }),
    watch: {
      '$route.path'() {
        this.showing = false
        this.hide()
      },
    },
    computed: {
      itemType () {
        return Object.keys(this.item).includes('colors')
          ? 'palette'
          : Object.keys(this.item).includes('value')
          ? 'color'
          : null
      },
      activeActions() {
        const possibleActions = ["rename", "delete", "duplicate"];
        switch (this.itemType) {
          case 'palette':
            return ['copy-colors', ...possibleActions]
          case 'color':
            return ['color', 'copy-colors', ...possibleActions, 'move']
          default:
            return [];
        }
      },
      parentNode() {
        return this.$el && this.$el.parentNode ? this.$el.parentNode : document.querySelector('main')
      }
    },
    methods: {
      handleAction(action) {
          // if(action === 'duplicate') {
          //   return this.$store.dispatch(`duplicate${capitalize(this.itemType)}`, this.item) 
          // }
          if(action === 'rename') {
            if(this.inputEl && this.inputEl.select) {
              return this.inputEl.select()
            }
            const nameInput = this.$parent.$el.querySelector('input[name="name-input"]')
            if(nameInput && nameInput.select) {
              return nameInput.select()
            }
          }
          if (this.$refs[`${action}Popover`] && this.$refs[`${action}Popover`][0] && this.$refs[`${action}Popover`][0].show) {
              this.$refs[`${action}Popover`][0].show();
          }
          // this.$emit(action, this.color.value);
      },
    }
  }
</script>

<style lang="scss">
.color-swatch, .grid-item {
  .popover-actions {
    .menu-toggle { 
      @apply absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full m-0 bg-opacity-10 text-shade-220 w-6 h-6 flex content-center items-center text-center p-0 text-opacity-50 hover:text-opacity-70;
    }
  }
}
.tooltip {
  @apply transition-all bg-shade-50 shadow-lg shadow-black/50 z-10 ease-in-out opacity-0 scale-0 absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 rounded py-1 px-1.5 whitespace-nowrap text-center;
}
.toggle-action-button {
  @apply z-0;
  &:hover {
    @apply z-2;
    .tooltip {
      @apply opacity-100 scale-100;
    }
  }
}
</style>