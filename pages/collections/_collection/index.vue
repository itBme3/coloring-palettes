<template>
  <ColorCollection
    v-if="$route.params.collection"
    class="page"
    :collection-id="$route.params.collection"
  />
</template>
