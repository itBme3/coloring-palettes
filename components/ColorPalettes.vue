<template>
  <div class="color-palettes"
    v-if="palettes">
    <button
      @click="$store.commit('newPalette')"
      class="
        py-6
        px-12
        !border-2 !border-dashed
        border-shade-50
        bg-transparent
        hover:shadow-xl
        shadow
        transform
        scale-100
        hover:scale-105
        mb-4
      "
      v-tooltip.right="{ content: 'Create New Palette', offset: '10' }"
    >
      <Icon icon="add" /> Palette
    </button>
    <div class="palettes-grid grid sm:grid-cols-2 gap-4">
      <ColorPaletteGridItem
        v-for="palette in palettes"
        :key="palette.id"
        :palette-id="palette.id"
        :link="false"
        :actions="true"
        item-style="compact"
        swatch-style="simple"
        class="!hover:scale-[1.01]"
        @click="$router.push(`/${palette.id}`)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      palettes: 'storedPalettes',
    }),
  },
};
</script>

<style lang="scss"></style>
