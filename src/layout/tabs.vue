<template>
  <div class="layout-tabs flex align-items-center w-full px-3 py-2">
    <div
      class="
        flex
        justify-content-center
        align-items-center
        h-3rem
        px-2
        py-1
        mr-2
        border-round border-1 border-500
        cursor-pointer
      "
      :class="targetPath === tab.fullPath ? 'bg-primary' : 'bg-white'"
      v-for="(tab, index) in tabsList"
      :key="index"
      @click="changeTabs(tab)"
      @contextmenu="onRightClick($event, index)"
      >{{ tab.meta.label
      }}<i
        v-if="tab.name !== 'home'"
        class="pi pi-times ml-1"
        @click.stop="deleteTabs('close', index)"
    /></div>
    <ContextMenu ref="contextMenuRef" :model="contextMenu" global />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useRoute, useRouter, RouteRecordRaw } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useAppStore } from '@/store'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { tabsList, deleteTabs, refreshLayout } = useAppStore()

  const activeIndex = ref(0)
  const contextMenuRef = ref()
  const contextMenu = computed(() => {
    return [
      {
        label: t('common.refresh'),
        icon: 'pi pi-replay',
        disabled: tabsList[activeIndex.value].fullPath !== route.fullPath,
        command: () => {
          refreshLayout()
        },
      },
      {
        label: t('common.close'),
        icon: 'pi pi-times',
        disabled: activeIndex.value === 0,
        command: () => {
          deleteTabs('close', activeIndex.value)
        },
      },
      {
        label: t('common.closeOther'),
        icon: 'pi pi-arrows-h',
        disabled: activeIndex.value === 0,
        command: () => {
          deleteTabs('other', activeIndex.value)
        },
      },
      {
        label: t('common.closeAll'),
        icon: 'pi pi-arrow-right-arrow-left',
        disabled: activeIndex.value === 0,
        command: () => {
          deleteTabs('all')
        },
      },
      {
        label: t('common.closeLeft'),
        icon: 'pi pi-angle-double-left',
        disabled: activeIndex.value === 0,
        command: () => {
          deleteTabs('left', activeIndex.value)
        },
      },
      {
        label: t('common.closeRight'),
        icon: 'pi pi-angle-double-right',
        disabled: activeIndex.value === 0,
        command: () => {
          deleteTabs('right', activeIndex.value)
        },
      },
    ]
  })

  const targetPath = computed(() => {
    return route.fullPath
  })

  const changeTabs = (tab: RouteRecordRaw) => {
    if (route.fullPath !== tab.fullPath) {
      router.push(tab.fullPath)
    }
  }

  const onRightClick = (event: Event, index: number) => {
    activeIndex.value = index
    contextMenuRef.value.show(event)
  }
</script>

<style lang="scss" scoped>
  .layout-tabs {
    border-bottom: 2px solid var(--surface-200);
  }
</style>
