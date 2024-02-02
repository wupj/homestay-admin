<template>
  <Card>
    <template #content>
      <div class="card-title">{{ $t('home.capitalIncomeRatio') }}</div>
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
  import { getFundIncomeRatio } from '@/api'

  const { t } = useI18n()
  const [loading, setLoading] = useLoading(false)
  const chartData = ref([])
  const [options] = useEcharts(
    {
      chartType: 'pie',
      unit: t('home.dollar'),
      group: {
        name: {
          earnestMoney: t('home.earnestMoney'),
          antecedentMoney: t('home.antecedentMoney'),
          housingExpenses: t('home.housingExpenses'),
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
