<template>
  <TransitionGroup
    :class="{ 'color-swatch': true, 'is-static': !actions && !clickable }"
    :name="animationName"
    tag="div"
    @mouseenter.native="hovered = true"
    @mouseleave.native="hovered = false"
  >
    <slot />
    <div
      v-if="
        activeActions &&
        (hovered || actionsHovered || (actionsHovered && activeAction))
      "
      key="actions"
      class="color-swatch-actions"
      @mouseenter="actionsHovered = true"
      @mouseleave="
        actionsHovered = false;
        activeAction = false;
      "
    >
      <transition name="scale-fade-pop">
        <div class="toggle-actions">
          <button
            v-for="anAction in activeActions"
            class="icon-button toggle-action-button"
            @click="(e) => handleAction(anAction)"
          >
            <Icon :icon="Array.isArray(anAction) ? anAction[1] : anAction" />
          </button>
        </div>
      </transition>
      <ColorPicker
        v-if="activeAction === 'edit'"
        picker-type="spectrum"
        :value="color.value"
        @update="(e) => $emit('color', { ...color, value: e })"
      />
      <button
        v-if="activeAction"
        class="toggle-action-button close"
        style="z-index: 3; position: absolute; left: 0; top: 0"
        @click="
          hover = false;
          activeAction = false;
          actionsHovered = false;
        "
      >
        <Icon icon="close"></Icon>
      </button>
    </div>
    <div
      key="color"
      class="color-swatch-color"
      v-if="show"
      :class="{
        ['style-' + swatchStyle]: true,
      }"
      :style="{
        background: hexColor,
        color: textColor,
        transition: 'ease-in-out all ' + this.animationDuration,
      }"
      @click="$emit('click', color)"
    >
      <small v-if="swatchStyle !== 'simple'">{{
        !!color.name ? color.name : color.value
      }}</small>
    </div>
  </TransitionGroup>
</template>

<script>
import chroma from 'chroma-js';

export default {
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
      default: 'tile',
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
  },
  data() {
    return {
      show: false,
      editingColor: false,
      hovered: false,
      actionsHovered: false,
      possibleActions: ['edit', 'copy', 'delete', 'duplicate', 'save'],
      activeAction: false,
      hexColor: chroma(this.color.value).hex(),
      textColor: this.getTextColor(),
      activeActions:
        Array.isArray(this.actions) && this.actions?.length
          ? this.actions
          : this.actions === true
          ? this.possibleActions
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
  computed: {},
  methods: {
    getTextColor() {
      const lightText = chroma
        .scale(['#fff', this.color.value])
        .colors(100)[10];
      const darkText = chroma.scale(['#000', this.color.value]).colors(100)[10];
      return chroma.contrast(darkText, this.color.value) >= 4.5
        ? darkText
        : lightText;
    },
    handleAction(action) {
      const handlers = {
        edit: () => {
          this.activeAction = 'edit';
        },
        copy: () => {
          this.activeAction = 'edit';
        },
        save: () => {
          this.activeAction = 'edit';
        },
      };
      if (Object.keys(handlers).includes(action)) {
        return handlers[action]();
      }
      this.$emit(action, this.color);
    },
  },
};
</script>

<style lang="scss">
.color-swatch {
  font-size: 7px;
  width: 50px;
  height: 50px;
  border-radius: 0.3rem;
  position: relative;
  z-index: 0;
  &.style-simple {
    width: 20px;
    border-radius: 0;
  }
  &:not(.is-static) {
    cursor: pointer;
  }
  &:hover {
    z-index: 2;
    &:not(.is-static) {
      transform: scale(1.1);
      transition: all 0.05s ease-in-out !important;
    }
  }
  .color-swatch-actions {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transition: all 0.1s ease-in;
    .toggle-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .toggle-action-button {
        font-size: 9px;
        padding: 0.2rem 0.15rem;
        transform: scale(0.9);
      }
    }
    .color-picker {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: auto;
    }
  }
  .color-swatch-color {
    width: 100%;
    height: 100%;
    border-radius: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    &.style-simple {
      border-radius: 0;
    }
  }
}
</style>
