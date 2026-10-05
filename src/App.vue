<script setup lang="ts">
import Users from './components/Users.vue';
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <h1>Лабораторна робота №3: Список користувачів</h1>
    </header>
    <main>
      <Users />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #f4f6f8;
}

.app-header {
  background-color: #24292f;
  color: #ffffff;
  padding: 16px 24px;
  text-align: center;
}

.app-header h1 {
  margin: 0;
  font-size: 22px;
}
</style>