<template>
  <div class="color-collections">
    <button
      @click="$store.commit('localStorage/newCollection')"
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
      v-tooltip.right="{ content: 'New Collection', offset: '10' }"
    >
      <Icon icon="add" />
    </button>
    <div class="collections-grid grid sm:grid-cols-2 gap-4">
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
