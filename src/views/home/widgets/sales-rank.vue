<template>
  <Card>
    <template #content>
      <div class="card-title">销售额排行榜</div>
      <div class="w-full h-20rem mt-2">
        <div class="w-full h-full">
          <div class="rank-title flex h-2rem align-items-center font-semibold">
            <span class="rank-index w-5rem">排行</span>
            <span class="rank-name flex-1 text-center">民宿名称</span>
            <span class="rank-value flex-1 text-center">销售额</span>
          </div>
          <div class="rank-content">
            <div
                class="rank-item flex align-items-center"
                v-for="(item, index) in salesData"
                :key="index"
            >
            <span class="rank-index w-5rem">
              <Badge :severity="severity[index]" :value="index + 1" />
            </span>
              <span class="rank-name flex-1 text-center">{{ item.homestayName }}</span>
              <span class="rank-value flex-1 text-center">{{ item.salesVolume }}</span>
            </div>
          </div>
          </div>
        <Loading :loading="loading" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import useLoading from '@/hooks/useLoading'
  import { getSalesVolumeTop } from '@/api'

  const [loading, setLoading] = useLoading(false)
  const severity = ref(['', 'info', 'success', 'warning', 'error'])
  const salesData = ref([])

  const getData = async () => {
    setLoading(true)
    const {
      response: {
        value: { data },
      },
    } = await getSalesVolumeTop()
    setLoading(false)
    salesData.value = data
  }

  onMounted(() => {
    getData()
  })
</script>

<style lang="scss" scoped>
.rank-content {
  height: calc(100% - 2rem);
  .rank-item {
    height: 20%;
  }
}
</style>
