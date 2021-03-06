<template>
  <span class="popover">
    <span class="popover-trigger">
      <slot name="trigger" />
    </span>
    <Teleport v-if="showing" to="main">
      <div class="overlay fixed inset-0" />
    </Teleport>
    <Teleport to=".site-container">
      <Transition
        name="scale-fade-pop">
        <div v-if="showing"
          ref="containerEl"
          class="popover-container absolute"
          :class="{
              ['' + classes.container + '']: !!classes.container
            }"
          :style="{
            ...popoverPosition,
            animationFillMode: 'both',
            maxWidth: maxWidth
          }">
          
          <div class="popover-heading"
            :class="{
              ['' + classes.heading + '']: !!classes.heading
            }">
            <slot name="heading" />
            <slot name="close">
              <button @click="hide()" class="popover-close"
                :class="{
                  ['' + classes.close + '']: !!classes.close
                }">
                <Icon icon="close" class="m-auto" />
              </button>
            </slot>
          </div>
          <div class="popover-body overflow-y-scroll"
            :class="{
              ['' + classes.body + '']: !!classes.body
            }">
            <slot />
          </div>
          <div class="popover-actions"
            :class="{
              ['' + classes.actions + '']: !!classes.actions
            }">
            <slot name="actions" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script>
  import Vue from 'vue'
  import Teleport from 'vue2-teleport'
import {asyncDelay} from '~/utils/funcs'
  export default {
    components: {
      Teleport
    },
    props: {
      maxWidth: {
        type: String,
        default: '320px'
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
      closeOnClick: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShowing: false,
        triggerEl: null,
        popoverPosition: {
          top: 0,
          left: 0
        }
      }
    },
    computed: {
      document() {
        return document === undefined ? { body: {} } : document
      },
      showing: {
        get() {
          return this.isShowing;
        },
        set(val) {
          this.isShowing = val
          if(!val) {
            try {
              this.$emit('exited');
              this.$refs.containerEl.removeEventListener('click', this.stopPropagationOnClick)
            } catch {}
          } else {
            function addClickListener(tried = 0) {
              const maxTries = 10;
              if(!this.$refs.containerEl || !this.$refs.containerEl.addEventListener) {
                if(tried >= maxTries) {
                  return
                }
                return asyncDelay(250).then(() => addClickListener(tried + 1))
              }
              this.$refs.containerEl.addEventListener('click', this.stopPropagationOnClick, {passive: true})
              this.setContainerPosition();
            }
            addClickListener = addClickListener.bind(this)
            addClickListener()
          }
          
        }
      }
    },
    watch: {
      
      '$store.state.window.size.width'() {
        this.showing = false
      },
      
    },
    mounted() {
      let initListeners = (tried = 0) => {
        const maxTries = 10
        if(tried === 0) {
          window.addEventListener('click', this.clickedOutside, {passive: true});
          document.addEventListener('keyup', this.keyEscape, {passive: true});
        }
        if(!this.triggerEl?.addEventListener) {
          if(tried >= maxTries) {return}
          this.triggerEl = this.$el.querySelector('.popover-trigger > *');
          if(this.triggerEl?.addEventListener) {
            this.triggerEl.addEventListener('click', this.triggerClicked, {passive: true})
          } else {
            return asyncDelay(250).then(() => initListeners(tried + 1))
          }
        }
      }
       initListeners = initListeners.bind(this)
      initListeners()
    },
    beforeUnmount() {
      this.removeListeners();
      this.hide();
    },
    methods: {
      triggerClicked(e) {
        this.stopPropagationOnClick(e, this.closeOnClick);
        this.showing = !this.showing
        this.setContainerPosition()
      },
      clickedOutside(e) {
        if(!this.showing) { return }
        this.showing = false
        e.stopPropagation();
      },
      keyEscape(e) {
        if(!this.showing) { return }
        if (e.keyCode == 27 || e.key === 'Enter') {
          this.showing = false
          this.hide();
          e.stopPropagation();
        }
      },
      stopPropagationOnClick(e, force = false) {
        this.$store.commit('window/setClick', e)
        if(this.closeOnClick && !force) {
          return
        }
        e.stopPropagation();
      },
      setContainerPosition(tried = 0) {
        const maxTries = 10;
        if(this.$refs.containerEl === undefined) {
          if(tried >= maxTries) {
            return;
          }
          return asyncDelay(100).then(() => this.setContainerPosition(tried + 1))
        }
        const containerWidth = this.$refs.containerEl.offsetWidth > document.body.offsetWidth
          ? document.body.offsetWidth  - 40
          : this.$refs.containerEl.offsetWidth;
        const containerHeight = this.$refs.containerEl.offsetHeight > document.body.offsetHeight
          ? document.body.offsetHeight - 60
          : this.$refs.containerEl.offsetHeight;
        let top = this.$store.state.window.click.y;
        let left = this.$store.state.window.click.x - (containerWidth * .5);
        if ((left + containerWidth) > (document.body.offsetWidth - 20) ) {
          left = document.body.offsetWidth - (containerWidth + 20);
        }
        if(left < 0) {
          left = 10
        }
        if(top < 40) {
          top = 20
        } else if(top + containerHeight > window.innerHeight) {
          top = document.body.offsetHeight - (containerHeight + 20);
        }
        this.popoverPosition = {
          top: `${top}px`,
          left: `${left}px`,
        };
        asyncDelay(400).then(() => window.scrollTo({left: 0, top: this.popoverPosition.top <= 100 ? 0 : this.popoverPosition.top - 100, behavior: 'smooth'}))
      },
      show() {
        asyncDelay(250).then(() => this.showing = true)
      },
      hide() {
        Vue.set(this, 'showing', false) 
        return asyncDelay(300)
      },
      removeListeners() {
        try {
          window.removeEventListener('click', this.clickedOutside); 
        } catch {}
        try {
          this.triggerEl.removeEventListener('click', this.triggerClicked)
        } catch {}
        try {
          this.$el.removeEventListener('click', this.stopPropagationOnClick); 
        } catch {}
        try {
          this.$refs.containerEl.removeEventListener('click', this.stopPropagationOnClick);
        } catch {}
        try {
          document.removeEventListener('keyup', this.keyEscape);
        } catch {}
      }
    }

  }
</script>

<style lang="scss">
.popover-container {
  animation-delay: .2s;
  width: auto;
  max-width: calc(100vw - 40px);
  min-width: 160px;
  @apply bg-shade-20 shadow-xl shadow-shade-10/30 rounded-md p-1 z-9999;
  .popover-body {
    @apply overflow-scroll;
    max-height: 80vh;
  }
}
.popover-heading {
  @apply rounded bg-shade-30 bg-opacity-30 mb-1;
}
.popover-close {
  @apply ml-auto bg-transparent text-red-400 w-6 h-6 p-0 flex items-center content-center;
}
</style>