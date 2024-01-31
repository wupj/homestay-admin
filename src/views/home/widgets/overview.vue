<template>
  <Card class="overview-card">
    <template #content>
      <div class="card-title">经营概况</div>
      <div class="relative flex justify-content-around align-items-center mt-4">
        <div
          class="
            grid
            w-2
            p-2
            text-white
            border-round-xl
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
        <Loading :loading="loading" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import useLoading from '@/hooks/useLoading'
  import { toFixed } from '@/utils'
  import { getManageProfile } from '@/api'

  const [loading, setLoading] = useLoading(false)
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
    setLoading(true)
    const { data } = await getManageProfile()
    setLoading(false)
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
      margin-top: 0;
      &:nth-of-type(1) {
        background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
      }
      &:nth-of-type(2) {
        background-image: linear-gradient(120deg, #3b41c5 0%, #a981bb 49%, #ffc8a9 100%);
      }
      &:nth-of-type(3) {
        background-image: linear-gradient(120deg, #d9afd9 0%, #97d9e1 100%);
      }
      &:nth-of-type(4) {
        background-image: linear-gradient(120deg, #9795f0 0%, #fbc8d4 100%);
      }
      &:nth-of-type(5) {
        background-image: linear-gradient(120deg, #a8caba 0%, #5d4157 100%);
      }
    }
  }
</style>
