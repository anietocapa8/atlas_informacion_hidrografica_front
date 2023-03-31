<script setup lang="ts">
import Header from './components/Header.vue';
import { ref } from 'vue';

const AppClass = ref(
    "h-screen w-screen bg-slate-200 dark:bg-slate-800 flex flex-col " +
    "text-blue-900 dark:text-blue-100 "
);
</script>

<template>
  <div :class="AppClass">
    <Header/>
    <router-view />
  </div>
</template>

<style scoped>

</style>
