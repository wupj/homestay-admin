<template>
  <div class="layout-topbar flex w-full h-5rem">
    <div class="flex-1 flex justify-content-end align-items-center">
      <i
        class="text-2xl pi mr-4 cursor-pointer"
        :class="{ 'pi-moon': theme === 'light', 'pi-sun': theme === 'dark' }"
        @click="handleTheme"
      />
      <i class="text-2xl pi pi-language mr-4 cursor-pointer" @click="changeLanguage" />
      <Menubar :model="barItems">
        <template #item="{ item, props, hasSubmenu, root }">
          <div v-if="root" class="cursor-pointer">
            <Avatar icon="pi pi-user" class="mr-2" size="large" shape="circle" />
            <div class="inline-block text-2xl font-semibold">admin</div>
          </div>
          <div v-else class="bar-item text-xl" @click="handleLogOut">
            <i :class="`pi ${item.icon} mr-2`" />
            <div class="inline-block">{{ item.label }}</div>
          </div>
        </template>
      </Menubar>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import useTheme from '@/hooks/useTheme'

  const barItems = ref([
    {
      label: '',
      icon: 'pi-user',
      items: [
        {
          label: '退出登录',
          icon: 'pi-sign-out',
        },
      ],
    },
  ])

  const { theme, initTheme, changeTheme } = useTheme()
  initTheme(theme.value)
  const handleTheme = () => {
    changeTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const changeLanguage = () => {}

  const handleLogOut = () => {}
</script>

<style lang="scss" scoped>
  .layout-topbar {
    border-bottom: 2px solid var(--surface-200);
    :deep(.p-menubar) {
      border: none;
      .bar-item {
        height: 3rem;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
  }
</style>
