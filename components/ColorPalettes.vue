<template>
  <div class="color-palettes"
    v-if="palettes">
    <client-only>
      
      <CreateNewPalette />

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
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            newPalette: {
                title: null,
                colors: [],
                id: null,
                handle: null
            }
        };
    },
    computed: {
        ...mapGetters({
            palettes: "storedPalettes",
        }),
    },
};
</script>

<style lang="scss"></style>
