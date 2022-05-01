<template>
  <div class="flex items-center">
    <v-popover class="mx-auto"
      :handle-resize="true"
      popover-class="flex flex-col shadow-lg transform !-top-[20px]"
      placement="bottom"
    ref="popoverElem">
      <button class="button bg-cyan-500 color-cyan-900">Click me</button>
      <template slot="popover">
        <div class="max-w-lg mx-auto flex flex-col pt-1 pb-2">
          <button class="button ml-auto mr-0 mb-1 !py-1" v-close-popover><Icon icon="close" /></button>
          <Transition name="down-fade">
            <SelectColor 
              @color="e => {
                color = e;
                $refs.popoverElem.hide()
              }" 
            />
          </Transition>
        </div>
      </template>
    </v-popover>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    data() {
      return {color: ''}
    },
    // mounted() {
    //   console.log(this.$refs.popoverElem.isOpen)
    // },
    computed: {
      popOpened() {
        return this.$refs.popoverElem && this.$refs.popoverElem.isOpen
      }
    },
    methods: {
      selectColor(e) {
        console.log(this.$refs.popoverElem)
      }
    }
  })
</script>

<style scoped>

</style>