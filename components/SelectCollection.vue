<template>
  <div class="select-collection">
    <InputSearch v-if="!hideSearch" v-model="q" />
    <div class="collections">
      <ColorCollectionGridItem
        v-for="collection in collections"
        :key="collection.id"
        :collection="collection"
        :link="false"
        item-style="compact"
        @click="$emit('select', collection)"
        class="transform !scale-95 !hover:scale-100"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    search: {
      type: String,
      default: '',
    },
    hideSearch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchValue: this.search,
    };
  },
  computed: {
    ...mapGetters({
      storedCollections: 'storedCollections',
    }),
    q: {
      get() {
        return this.searchValue;
      },
      set(val) {
        this.searchValue = val;
        this.$emit('input', val);
      },
    },
    collections() {
      const words = this.q.split(' ').map((w) => w.toLowerCase().trim());
      return !this.q?.length
        ? this.storedCollections
        : this.storedCollections.filter(
            (p) =>
              words.filter((w) => JSON.stringify(p).toLowerCase().includes(w))
                .length === words.length
          );
    },
  },
  watch: {
    search(val) {
      this.q = val;
    },
  },
};
</script>
