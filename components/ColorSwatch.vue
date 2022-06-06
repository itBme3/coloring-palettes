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
          class="m-auto px-3 opacity-50 group-hover:opacity-100 transform scale-80 inline-block"
          :class="{
            'text-xs': collapsedActions,
            'text-base': !collapsedActions,
          }">
          {{ color.value }}
        </small>
        <input 
          v-if="!collapsedActions"
          ref="nameInput"
          name="name-input"
          key="color-name-input"
          type="text"
          class="my-auto ml-4 mr-12 bg-opacity-0 group-hover:bg-shade-30 group-hover:bg-opacity-5 group-hover:text-shade-190 focus-visible:ring-offset-shade-20 w-full"
          :style="{
            color: textColor + ' !important'
          }"
          :value="!!color.name ? color.name : color.value"
          @input="e => $store.dispatch('updateColor', { ...color, name: e.target.value })"
        />
        <slot />
      </div>




      <div
        v-if="activeActions && activeActions.filter(a => a !== 'color').length"
        key="actions"
        class="color-swatch-actions group"
        @mouseenter="actionsHovered = true"
        
      >
      <KeepAlive>
        <PopoverActions
          v-if="hovered"
          :item="color" 
          :text-color="textColor" 
          :input-el="$refs.nameInput"
          @color="(e) => $emit('color', e.color.value)"
          />
       </KeepAlive>

      </div>
      
    </template>
    <PopoverAction
      v-if="updateColorSwatchClick || (activeActions && activeActions.join && activeActions.join('') === 'color')"
      key="changeColor"
      ref="colorPopover"
      :item="color"
      action="color"
      :only-emit="onlyEmit"
      :close-on-click="false"
      @color="(e) => $emit('color', e.color.value)">
    </PopoverAction>
  </TransitionGroup>
</template>

<script>
import chroma from 'chroma-js';
import { defineComponent } from '@vue/runtime-core';
import { mapGetters } from 'vuex';
import Popover from './Popover.vue';

export default defineComponent({
    name: "color-swatch",
    props: {
        color: {
            type: Object,
            default: () => {
                return { value: "cyan", name: null };
            },
        },
        swatchStyle: {
            type: String,
            default: "tile", /* tile, list-item, simple */
        },
        delayShow: {
            type: Number,
            default: 0,
        },
        animationName: {
            type: String,
            default: "scale-fade",
        },
        animationDuration: {
            type: String,
            default: ".25s",
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
            default: ".drag-handle",
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
        const possibleActions = ["rename", "color", "copyColors", "delete", "duplicate", "move"];
        return {
            show: false,
            editingColor: false,
            hovered: false,
            actionsHovered: false,
            possibleActions,
            activeAction: false,
            hexColor: chroma(this.color.value).hex(),
            textColor: this.getTextColor(),
            activeActions: Array.isArray(this.actions) && this.actions?.length
                ? this.actions
                : this.actions === true
                    ? possibleActions
                    : this.updateColorSwatchClick
                        ? ["color"]
                        : false,
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
        ...mapGetters({
            palettes: "storedPalettes"
        }),
        collapsedActions() {
            return this.$el.offsetWidth < 300;
        }
    },
    methods: {
        chroma,
        getTextColor() {
            const lightText = chroma
                .scale(["#fff", this.color.value])
                .colors(100)[10];
            const darkText = chroma.scale(["#000", this.color.value]).colors(100)[10];
            const textColor = chroma.contrast(darkText, this.color.value) >= 4.5
                ? darkText
                : lightText;
            return `rgba(${chroma(textColor).rgba().slice(0, 3).join(", ")}, var(--tw-text-opacity))`;
        },
        handleAction(action) {
            if (this.$refs[`${action}Popover`] && this.$refs[`${action}Popover`][0] && this.$refs[`${action}Popover`][0].show && !this.onlyEmit) {
                this.$refs[`${action}Popover`][0].show();
            }
            this.$emit(action, this.color.value);
        },
    },
    components: { Popover }
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
    @apply w-full bg-shade-20 shadow py-1 pl-1 overflow-x-scroll h-20 flex items-center content-between;
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
