<template>
  <ColorPalette
    v-if="$route.params.palette"
    class="page"
    :palette-id="$route.params.palette"
  />
</template>
