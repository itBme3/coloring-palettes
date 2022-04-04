<template>
  <ColorCollection
    v-if="$route.params.collectionId"
    class="page"
    :collection-id="$route.params.collectionId"
  />
</template>
