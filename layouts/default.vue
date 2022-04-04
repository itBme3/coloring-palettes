<template>
  <div class="site-container">
    <HeaderNavigation />
    <main style="display: block">
      <Nuxt :key="$route.fullPath" />
    </main>
  </div>
</template>
