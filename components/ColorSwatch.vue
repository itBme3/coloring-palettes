<template>
  <TransitionGroup
    :class="{
      'color-swatch group': true,
      'is-static': !actions && !clickable && !updateColorSwatchClick,
      ['style-' + swatchStyle]: true,
    }"
    :name="animationName"
    tag="div"
    @mouseenter.native="hovered = true"
    @mouseleave.native="hovered = false"
    :handle="dragHandleSelector"
  >
  <template v-if="show">
      <slot v-if="draggable"
         name="dragHandle">
            <Icon
              key="drag-handle"
              class="
                drag-handle
                text-base
                cursor-move
                absolute
                left-1
                top-1
                opacity-0
                text-opacity-0
                group-hover:opacity-100
                group-hover:text-opacity-40
                z-10
              "
              :style="{color: textColor}"
              icon="grip"
            />
      </slot>
      <slot />
      <div
        key="color"
        class="color-swatch-color group"
        :class="{
          'cursor-default !scale-100 !hover:scale-100': !clickable,
        }"
        :style="{
          background: hexColor,
          color: textColor,
          transition: 'ease-in-out all ' + this.animationDuration,
        }"
        @click="() => {
          $emit('click', color);
          updateColorSwatchClick && $refs.colorPopover && $refs.colorPopover[0] ? $refs.colorPopover[0].show() : ''
        }"
      >
        <small v-if="swatchStyle !== 'simple'"
          class="m-auto opacity-50 group-hover:opacity-100"
          :class="{
            'text-xs': collapsedActions,
            'text-base': !collapsedActions,
          }">
          {{ color.value }}
        </small>
      </div>




      <div
        v-if="activeActions && activeActions.filter(a => a !== 'color').length"
        key="actions"
        class="color-swatch-actions"
        @mouseenter="actionsHovered = true"
        
      >
        <input 
          v-if="!collapsedActions"
          ref="nameInput"
          key="color-name-input"
          type="text"
          class="my-auto ml-4 mr-8 bg-opacity-0 group-hover:bg-shade-40 group-hover:bg-opacity-5 group-hover:text-shade-190 focus-visible:ring-offset-shade-20 w-full"
          :style="{
            color: collapsedActions ? textColor : 'rgb(200,200,220)'
          }"
          :value="!!color.name ? color.name : color.value"
          @input="e => $store.dispatch('updateColor', { ...color, name: e.target.value })"
        />
        <component 
          :is="!collapsedActions ? 'Transition' : 'Popover'"
          :name="animationName"
          :close-on-click="true">
          <template #trigger v-if="collapsedActions">
            <button 
              class="menu-toggle absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 m-0 bg-opacity-10 text-shade-220 w-6 h-6 flex content-center items-center text-center p-0 text-opacity-50 hover:text-opacity-70"
              :style="{color: textColor, backgroundColor: textColor.split('text-').join('bg-') }">
              <Icon 
                class="m-auto"
                :icon="`ellipsis${swatchStyle === 'list-item' ? '-vertical' : ''}`"
              />
            </button>
          </template>

          <div v-if="hovered || collapsedActions"
            class="toggle-actions flex"
            key="toggleActions"
            :class="{
              'flex-col content-start items-stretch space-y-1 mx-0': collapsedActions,
              'flex-row content-end items-center space-x-1 ml-auto mr-0': !collapsedActions,
            }">
              <button
                v-for="anAction in activeActions"
                v-tooltip:above="!collapsedActions ? anAction : undefined"
                class="icon-button toggle-action-button items-center flex group"
                :class="{
                  'content-center': !collapsedActions,
                  'content-end py-2 w-full': collapsedActions,
                }"
                @click="(e) => handleAction(anAction)"
              >
                <small class="text-xs text-gray-400 font-normal mr-auto pr-2" v-if="collapsedActions">{{anAction}}</small>
                <Icon
                  class="opacity-50 group-hover:opacity-100"
                  :icon="Array.isArray(anAction) ? anAction[1] : anAction"
                />
              </button>
          </div>
        </component>

      <template v-if="hovered">
        <PopoverActions
          v-for="action in activeActions" 
          :key="action"
          :ref="action + 'Popover'"
          :item="color"
          :action="action"
          :input-el="$refs.nameInput"
          :only-emit="onlyEmit"
          :close-on-click="['delete'].includes(action)"
          @color="(e) => action === 'color' ? $emit(action, e.color.value) : ''"
          >
        </PopoverActions>
      </template>

      </div>
    </template>
    <PopoverActions
      v-if="activeActions && activeActions.join && activeActions.join('') === 'color'"
      key="changeColor"
      ref="colorPopover"
      :item="color"
      action="color"
      :only-emit="onlyEmit"
      :close-on-click="false"
      @color="(e) => $emit('color', e.color.value)">
    </PopoverActions>
  </TransitionGroup>
</template>

<script>
import chroma from 'chroma-js';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  name: 'color-swatch',
  props: {
    color: {
      type: Object,
      default: () => {
        return { value: 'cyan', name: null };
      },
    },
    swatchStyle: {
      type: String,
      default: 'tile', /* tile, list-item, simple */
    },
    delayShow: {
      type: Number,
      default: 0,
    },
    animationName: {
      type: String,
      default: 'scale-fade',
    },
    animationDuration: {
      type: String,
      default: '.25s',
    },
    actions: {
      type: [Array, Boolean],
      default: false,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    dragHandleSelector: {
      type: String,
      default: '.drag-handle',
    },
    updateColorSwatchClick: {
      type: Boolean,
      default: true
    },
    onlyEmit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const possibleActions = ['rename', 'color', 'copyColors', 'delete', 'duplicate', 'move'];
    return {
      show: false,
      editingColor: false,
      hovered: false,
      actionsHovered: false,
      possibleActions,
      activeAction: false,
      hexColor: chroma(this.color.value).hex(),
      textColor: this.getTextColor(),
      activeActions:
        Array.isArray(this.actions) && this.actions?.length
          ? this.actions
          : this.actions === true
          ? possibleActions
          : this.updateColorSwatchClick 
          ? ['color']
          : false,
      paletteId: null
    };
  },
  mounted() {
    setTimeout(() => {
      this.show = true;
    }, this.delayShow);
  },
  watch: {
    color(color) {
      this.hexColor = chroma(color.value).hex();
      this.textColor = this.getTextColor();
    },
  },
  computed: {
    collapsedActions() {
      return (this.swatchStyle !== 'list-item' || this.$el.offsetWidth < 200)
    }
  },
  methods: {
    chroma,
    getTextColor() {
      const lightText = chroma
        .scale(['#fff', this.color.value])
        .colors(100)[10];
      const darkText = chroma.scale(['#000', this.color.value]).colors(100)[10];
      const textColor = chroma.contrast(darkText, this.color.value) >= 4.5
        ? darkText
        : lightText;
      return `rgba(${chroma(textColor).rgba().slice(0,3).join(', ')}, var(--tw-text-opacity))`
    },
    log(e) {
      console.log(e)
    },
    handleAction(action) {
      if(this.$refs[`${action}Popover`] && this.$refs[`${action}Popover`].show && !this.onlyEmit) {
        this.$refs[`${action}Popover`].show()
      }
      this.$emit(action, this.color.value);
    },
  },
});
</script>

<style lang="scss">
.color-swatch {
  @apply relative z-0 w-16 h-16;
  &:not(.style-simple) {
    @apply rounded;
    .color-swatch-color {
      @apply rounded;
    }
  }
  .color-swatch-color {
    @apply w-full h-full flex items-center content-center text-center;
  }
  .color-swatch-actions {
    @apply absolute inset-0 top-1/2 transition-all ease-in duration-100 transform -translate-y-1/2;
    .toggle-actions {
      .toggle-action-button {
        @apply text-[9px] px-[.2rem] py-[.15rem] transform scale-90;
      }
    }
    .color-picker {
      @apply absolute inset-0 h-auto;
    }
  }
  .menu-toggle {
    @apply hover:bg-opacity-20 #{!important};
  }

  &.style-simple {
    @apply w-5;
    .color-swatch-color {
      @apply rounded-sm;
    }
  }
  &.style-list-item {
    @apply w-full bg-shade-30 shadow py-1 pl-1 overflow-x-scroll h-20 flex items-center content-between;
    .popover {
      @apply ml-auto mr-0;
    }
    .color-swatch-color {
      @apply w-full absolute inset-0;
      * {
        @apply m-auto;
      }
    }
    .color-swatch-actions  {
      @apply sm:relative inset-auto ml-auto my-auto mr-0 flex flex-row w-full items-center translate-y-0 content-end;
      .toggle-actions {
        @apply mr-4;
      }
      .toggle-action-button {
        @apply scale-100 text-base w-full p-2;
      }
    }
  }
  &:not(.is-static) {
    @apply transform cursor-pointer hover:scale-103 scale-100 transition-all duration-75 ease-in-out hover:z-2;
  }
}
  
  .popover {
      .toggle-actions {
          @apply flex flex-col content-start items-stretch space-y-2;
          button {
            @apply w-full;
          }
      }
  }

</style>
