<template>
<div class="layout-wrapper flex flex-row">
  <sidebar />
  <div class="layout-main-container flex-1">
    <Topbar />
    <div class="layout-main p-3">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import Sidebar from './sidebar'
import Topbar from './topbar'
</script>

<style lang="scss" scoped>
  .layout-wrapper {
    width: 100%;
    min-height: 100vh;
  }
</style>