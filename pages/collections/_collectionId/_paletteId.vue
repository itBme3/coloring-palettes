<template>
  <ColorPalette
    v-if="$route.params.paletteId"
    class="page"
    :palette-id="$route.params.paletteId"
    :collection-id="$route.params.collectionId"
  />
</template>
