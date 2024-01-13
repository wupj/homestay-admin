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
                <span :class="item.icon" />
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

  import SvgIcon from '@/components/basic/svgIcon'

  const route = useRoute()

  console.log(route)

  const menus = ref([
    { label: '首页', icon: 'pi pi-home', route: '/home' },
    { label: '订单管理', icon: 'pi pi-book', route: '/order/list' },
    { label: '民宿管理', icon: 'pi pi-building', route: '/homestay/list' },
    { label: '优惠券管理', icon: 'pi pi-ticket', route: '/coupon/list' },
    { label: '角色管理', icon: 'pi pi-id-card', route: '/role/list' },
    { label: '用户管理', icon: 'pi pi-user', route: '/user/list' },
    { label: '操作日志', icon: 'pi pi-list', route: '/log/list' },
  ])

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
