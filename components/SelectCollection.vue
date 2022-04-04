<template>
  <div class="select-collection">
    <div class="collections">
      <ColorCollectionGridItem
        v-for="collection in storedCollections"
        :key="collection.id"
        :collection="collection"
        :link="false"
        item-style="compact"
        @click="selectCollection(collection)"
        class="transform !scale-95 !hover:scale-100"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      storedCollections: 'storedCollections',
    }),
  },
  methods: {
    selectCollection(collection) {
      console.log(collection);
    },
  },
};
</script>
