<template>
  <div class="color-collections">
    <button
      @click="$store.commit('newCollection')"
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
      v-tooltip.right="{ content: 'Crate Collection', offset: '10' }"
    >
      <Icon icon="add" /> Collection
    </button>
    <div class="collections-grid grid gap-4">
      <ColorCollectionGridItem
        v-for="collection in collections"
        :key="collection.id"
        :collection="collection"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      collections: 'storedCollections',
    }),
  },
};
</script>

<style lang="scss"></style>
