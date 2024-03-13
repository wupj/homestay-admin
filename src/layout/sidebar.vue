<template>
  <div class="layout-sidebar w-18rem h-screen">
    <Card>
      <template #content>
        <div class="logo w-full h-5rem flex justify-content-start align-items-center"
          ><SvgIcon class="w-4rem h-full" iconName="logo" className="logo" />
          <div class="text-2xl font-semibold ml-4">共享民宿系统</div></div
        >
        <Menu :model="menus">
          <template #item="{ item, props }">
            <router-link v-slot="{ href, navigate }" :to="item.route" custom>
              <a
                class="text-xl"
                :class="{ 'bg-primary-100 text-primary': targetPath === href }"
                :href="href"
                v-bind="props.action"
                @click="navigate"
              >
                <span :class="`pi ${item.icon}`" />
                <span class="ml-2">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </Menu>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAppStore } from '@/store'

  const route = useRoute()
  const appStore = useAppStore()

  const menus = computed(() => {
    const list = []
    appStore.menus.forEach(item => {
      list.push({
        label: item.label,
        icon: item.icon,
        route: item.children?.length ? item.children[0].path : item.path
      })
    })
    return list
  })

  watch(
    () => route.fullPath,
    (val) => {
      console.log(val)
    }
  )

  const targetPath = computed(() => {
    return route.fullPath
  })
</script>

<style lang="scss" scoped>
  .layout-sidebar {
    :deep(.p-menu) {
      height: calc(100vh - 5rem);
      border: none;
    }
  }
</style>
