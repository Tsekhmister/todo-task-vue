<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App component - main application wrapper
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { initializeAuth } = useAuth()

// Initialize authentication state when app loads
onMounted(() => {
  console.log('🚀 App mounted, initializing authentication...')
  initializeAuth()
})
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
