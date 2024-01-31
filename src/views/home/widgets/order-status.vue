<template>
  <Card>
    <template #content>
      <div class="card-title">订单状态占比</div>
      <div class="relative w-full h-20rem mt-2">
        <Charts :option="options" />
        <Loading :loading="loading" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import useLoading from '@/hooks/useLoading'
  import useEcharts from '@/hooks/useEcharts'
  import { getOrderStatusRatio } from '@/api'

  const [loading, setLoading] = useLoading(false)
  const chartData = ref([])
  const [options] = useEcharts(
    {
      chartType: 'pie',
      radius: true,
      unit: '%',
      group: {
        name: {
          unpaidRatio: '待支付',
          confirmedRatio: '已确认',
          beingRefundedRatio: '退款中',
          refundedRatio: '已退款',
        },
      },
    },
    chartData
  )

  const getChartData = async () => {
    setLoading(true)
    const {
      response: {
        value: { data },
      },
    } = await getOrderStatusRatio()
    setLoading(false)
    chartData.value = data
  }

  onMounted(() => {
    getChartData()
  })
</script>

<style scoped></style>
