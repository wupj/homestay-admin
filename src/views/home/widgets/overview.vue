<template>
  <Card class="overview-card">
    <template #content>
      <div class="card-title">经营概况</div>
      <div class="flex justify-content-around align-items-center mt-4">
        <div
          class="
            grid
            w-2
            p-2
            border-round-xl
            surface-100
            flex flex-column
            justify-content-start
            align-items-center
          "
          v-for="(list, index) in profileList"
          :key="index"
        >
          <div class="title text-2xl line-height-3 font-semibold">{{ list.label }}</div>
          <div class="value text-xl line-height-3 font-semibold">{{ profileData[list.key] }}</div>
          <div class="ratio text-lg line-height-3" v-if="list.ratio"
            >{{ toFixed(profileData[list.ratio], 2) }}%</div
          >
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { toFixed } from '@/utils'
  import { getManageProfile } from '@/api'

  const profileList = ref([
    {
      key: 'homestayTotal',
      label: '民宿总数',
    },
    {
      key: 'todayVisitor',
      ratio: 'visitorRatio',
      label: '今日访问量',
    },
    {
      key: 'todaySales',
      ratio: 'salesRatio',
      label: '今日销售额',
    },
    {
      key: 'todayOrderVolume',
      ratio: 'orderVolumeRatio',
      label: '今日订单量',
    },
    {
      key: 'todayRevenue',
      ratio: 'revenueRatio',
      label: '今日总收入',
    },
  ])
  const profileData = ref({})

  const getProfileData = async () => {
    const { data } = await getManageProfile()
    profileData.value = data.value
  }

  onBeforeMount(() => {
    getProfileData()
  })
</script>

<style lang="scss" scoped>
  .overview-card {
    .grid {
      height: 7rem;
    }
  }
</style>
