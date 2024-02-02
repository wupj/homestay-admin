<template>
  <Card>
    <template #content>
      <div class="card-title">{{ $t('home.orderStatusRatio') }}</div>
      <div class="relative w-full h-20rem mt-2">
        <Charts :option="options" />
        <Loading :loading="loading" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import useLoading from '@/hooks/useLoading'
  import useEcharts from '@/hooks/useEcharts'
  import { getOrderStatusRatio } from '@/api'

  const { t } = useI18n()
  const [loading, setLoading] = useLoading(false)
  const chartData = ref([])
  const [options] = useEcharts(
    {
      chartType: 'pie',
      radius: true,
      unit: '%',
      group: {
        name: {
          unpaidRatio: t('home.toBePaid'),
          confirmedRatio: t('home.confirmed'),
          beingRefundedRatio: t('home.refundProgress'),
          refundedRatio: t('home.refunded'),
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
