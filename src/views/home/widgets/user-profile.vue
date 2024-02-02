<template>
  <Card>
    <template #content>
      <div class="card-title">{{ $t('home.userProfile') }}</div>
      <div class="relative w-full h-20rem mt-2">
        <Charts class="inline-block w-6" :option="pieOptions" />
        <Charts class="inline-block w-6" :option="barOptions" />
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
  import { getUserPortrait, getCrowdAgeRatio } from '@/api'

  const { t } = useI18n()
  const [loading, setLoading] = useLoading(false)
  const pieData = ref([])
  const [pieOptions] = useEcharts(
    {
      chartType: 'pie',
      radius: true,
      unit: t('home.people'),
      group: {
        name: {
          man: t('home.man'),
          woman: t('home.woman'),
        },
      },
    },
    pieData,
    {
      title: {
        show: true,
        text: t('home.customerGenderRatio'),
        left: 'center',
        textStyle: {
          fontSize: 14,
        },
      },
    }
  )
  const barData = ref([])
  const [barOptions] = useEcharts(
    {
      chartType: 'bar',
      type: 'horizontal',
      xAxisField: 'category',
      yAxisField: 'ratio',
      legendName: t('home.peopleNumbers'),
      unit: '%',
    },
    barData,
    {
      title: {
        show: true,
        text: t('home.populationAgeRatio'),
        left: 'center',
        textStyle: {
          fontSize: 14,
        },
      },
      grid: {
        top: 30,
      },
      yAxis: {
        inverse: true,
        axisTick: {
          show: false
        }
      }
    }
  )

  const getChartData = async () => {
    setLoading(true)
    const [res1, res2] = await Promise.all([getUserPortrait(), getCrowdAgeRatio()])
    setLoading(false)
    pieData.value = res1.data.value
    barData.value = res2.data.value
  }

  onMounted(() => {
    getChartData()
  })
</script>

<style lang="scss" scoped></style>
