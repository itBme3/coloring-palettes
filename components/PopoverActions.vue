<template>

<div class="popover-actions"
  v-if="item">
  <component
    :is="collapsedActions ? 'Popover' : 'div'"
    :close-on-click="true">
    <template #trigger v-if="collapsedActions">
      <button 
        class="menu-toggle absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 m-0 bg-opacity-10 text-shade-220 w-6 h-6 flex content-center items-center text-center p-0 text-opacity-50 hover:text-opacity-70"
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
        'flex-row content-end items-center space-x-1 ml-auto mr-0 opacity-0 scale-50 group-hover:scale-100 group-hover:opacity-100': !collapsedActions,
      }">
        <button
          v-for="action in activeActions"
          v-tooltip="!collapsedActions ? {content: action, position: 'top', offset: 6, boundariesElement: $el.parentNode} : undefined"
          class="icon-button toggle-action-button items-center flex group"
          :class="{
            'content-center': !collapsedActions,
            'content-end py-2 w-full': collapsedActions,
          }"
          @click="(e) => handleAction(action)"
        >
          <small class="text-xs text-gray-400 font-normal mr-auto pr-2" v-if="collapsedActions">{{action}}</small>
          <Icon
            class="opacity-50 group-hover:opacity-100"
            :icon="Array.isArray(action) ? action[1] : action"
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
    :close-on-click="['delete'].includes(action)"
    :text-color="textColor"
    :max-width="action === 'move' ? '500px' : '300px' "
    @color="(e) => action === 'color' ? $emit('color', e) : ''"
    />
</div>

</template>

<script>
  import { capitalize } from '@vue/shared';
import Vue from 'vue'
  export default Vue.extend({
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
    mounted() {
      
    },
    computed: {
      itemType () {
        return Object.keys(this.item).includes('palettes')
          ? 'collection'
          : Object.keys(this.item).includes('colors')
          ? 'palette'
          : Object.keys(this.item).includes('value')
          ? 'color'
          : null
      },
      activeActions() {
        const possibleActions = ["rename", "delete", "duplicate"];
        switch (this.itemType) {
          case 'collection':
            return possibleActions
          case 'palette':
            return ['copyColors', ...possibleActions, 'move']
          case 'color':
            return ['color', 'copyColors', ...possibleActions, 'move']
          default:
            return [];
        }
      }
    },
    methods: {
      handleAction(action) {
          if(action === 'duplicate') {
            return this.$store.dispatch(`duplicate${capitalize(this.itemType)}`, this.item) 
          }
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
  })
</script>

<style scoped>

</style>