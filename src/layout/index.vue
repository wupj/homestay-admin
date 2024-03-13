<template>
  <div class="layout-wrapper flex flex-row">
    <sidebar />
    <div class="layout-main-container flex-1">
      <Topbar />
      <Tabs />
      <div class="layout-main p-3">
        <Loading v-if="layoutLoading" :loading="layoutLoading" />
        <router-view v-else></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/store'

  import Sidebar from './sidebar'
  import Topbar from './topbar'
  import Tabs from './tabs'

  const { layoutLoading } = storeToRefs(useAppStore())
</script>

<style lang="scss" scoped>
  .layout-wrapper {
    width: 100%;
    min-height: 100vh;
    .layout-main {
      min-height: calc(100vh - 9.15rem);
    }
  }
</style>
