<template>
  <Card>
    <template #content>
      <div class="card-title">资金收入占比</div>
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
  import { getFundIncomeRatio } from '@/api'

  const [loading, setLoading] = useLoading(false)
  const chartData = ref([])
  const [options] = useEcharts(
    {
      chartType: 'pie',
      unit: '元',
      group: {
        name: {
          earnestMoney: '定金',
          antecedentMoney: '押金',
          housingExpenses: '房费',
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
    } = await getFundIncomeRatio()
    setLoading(false)
    chartData.value = data
  }

  onMounted(() => {
    getChartData()
  })
</script>

<style scoped></style>
