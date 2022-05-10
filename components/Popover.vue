<template>
  <span class="popover">
    <span class="popover-trigger">
      <slot name="trigger" />
    </span>
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
            maxWidth: maxWidth + ' !important'
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
          <div class="popover-body max-h-full overflow-y-scroll"
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
  export default Vue.extend({
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
        showing: false,
        triggerEl: null,
        popoverPosition: {
          top: 0,
          left: 0
        }
      }
    },
    watch: {
      
      '$route.path'() {
        this.showing = false
      },
      '$store.state.window.size.width'() {
        this.showing = false
      },
      showing(val) {
        if(!val) {
          try {
            this.$emit('exited');
            this.$refs.containerEl.removeEventListener('click', this.stopPropagationOnClick);
          } catch {}
        } else {
          // if(this.$refs.containerEl) {
          //   this.setContainerPosition();
          // }
          let addClickListener = (tried = 0) => {
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
    },
    mounted() {
      let initListeners = (tried = 0) => {
        const maxTries = 10
        if(tried === 0) {
          window.addEventListener('click', this.clickedOutside, {passive: true}); 
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
    destroyed() {
      try {
        window.removeEventListener('click', this.detectClickOutside); 
      } catch {}

      try {
        this.triggerEl.removeEventListener('click', this.triggerClicked)
      } catch {}
      try {
        this.$el.removeEventListener('click', this.stopPropagationOnClick); 
      } catch {}
    },
    methods: {
      triggerClicked(e) {
        this.stopPropagationOnClick(e, this.closeOnClick);
        this.showing = !this.showing
        this.setContainerPosition()
      },
      clickedOutside() {
        if(!this.showing) {return}
        this.showing = false
      },
      stopPropagationOnClick(e, force = false) {
        this.$store.commit('window/setClick', e)
        if(this.closeOnClick && !force) {return}
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
        let top = `${this.$store.state.window.click.y - ((this.$refs.containerEl && this.$refs.containerEl.offsetHeight ? this.$refs.containerEl.offsetHeight : 0) / 2)}px`;
        let left = `${this.$store.state.window.click.x - ((this.$refs.containerEl && this.$refs.containerEl.offsetWidth ? this.$refs.containerEl.offsetWidth : 0) / 2)}px`;
        if (parseInt(left) + this.$refs.containerEl.offsetWidth > document.body.offsetWidth ) {
          if(this.$refs.containerEl.offsetWidth > document.body.offsetWidth ) {
            this.$refs.containerEl.style.width = `${document.body.offsetWidth  - 40}px`
            left = '20px'
          } else {
            left = `${document.body.offsetWidth - (this.$refs.containerEl.offsetWidth + 20)}px`
          }
        }
        if(parseInt(top) < 40) {
          top = '20px'
        } else if(parseInt(top) + this.$refs.containerEl.offsetHeight > document.body.offsetHeight) {
          top = `${document.body.offsetHeight - (this.$refs.containerEl.offsetHeight + 20)}px`
        }
        this.popoverPosition = {
          top: parseInt(top) < 40 ? '40px' : top,
          left: `${this.$store.state.window.click.x - ((this.$refs.containerEl && this.$refs.containerEl.offsetWidth ? this.$refs.containerEl.offsetWidth : 0) / 2)}px`,
        };
        asyncDelay(400).then(() => window.scrollTo({left: 0, top: parseInt(this.popoverPosition.top) - 100, behavior: 'smooth'}))
      },
      show() {
        asyncDelay(100).then(() => this.showing = true)
      },
      hide() {
        this.showing = false
      }
    }

  })
</script>

<style lang="scss">
.popover-container {
  animation-delay: .2s;
  // max-height: calc(100vh - 2rem);
  width: auto;
  @apply bg-shade-30 shadow-xl shadow-shade-10/30 rounded-md p-1 z-9999;
  .popover-body {
    @apply overflow-scroll;
    max-height: 80vh;
  }
}
.popover-heading {
  @apply rounded bg-shade-40 bg-opacity-30 mb-1;
}
.popover-close {
  @apply ml-auto bg-transparent text-red-400 w-6 h-6 p-0 flex items-center content-center;
}
</style>