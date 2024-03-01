<template>
  <Card>
    <template #content>
      <div class="flex justify-content-between justify-content-center align-items-center">
        <div class="card-title">{{ $t('home.visitsTrend') }}</div>
        <div class="flex flex-row">
          <SelectButton
            class="inline-block mr-4"
            v-model="dateType"
            :options="dateOptions"
            @change="changDateType"
            optionLabel="name"
            optionValue="value"
          />
          <Calendar
            v-if="dateType === 'week'"
            v-model="date"
            selectionMode="range"
            dateFormat="yy-mm-dd"
            :placeholder="$t('coupon.selectTimePeriod')"
            :manualInput="false"
            @date-select="getChartData"
            showIcon
          />
          <Calendar
            v-if="dateType === 'month'"
            v-model="date"
            view="month"
            selectionMode="range"
            dateFormat="yy-mm"
            :manualInput="false"
            @date-select="getChartData"
            showIcon
          />
        </div>
      </div>
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
  import dayjs from 'dayjs'
  import useLoading from '@/hooks/useLoading'
  import useEcharts from '@/hooks/useEcharts'
  import { getAccessTrend } from '@/api'

  const { t } = useI18n()
  const [loading, setLoading] = useLoading(false)
  const dateType = ref('day')
  const date = ref<any>()
  const dateOptions = ref([
    { name: t('home.today'), value: 'day' },
    { name: t('home.week'), value: 'week' },
    { name: t('home.month'), value: 'month' },
  ])
  const chartData = ref([])

  const [options] = useEcharts(
    {
      chartType: 'line',
      type: 'area',
      xAxisField: 'time',
      yAxisField: 'pv',
      legendName: t('home.visits'),
    },
    chartData,
    {
      xAxis: {
        axisLabel: {
          formatter: (value) => {
            if (dateType.value === 'day') {
              return dayjs(value).format('HH:mm')
            }
            if (dateType.value === 'week') {
              return dayjs(value).format('MM-DD')
            }
            if (dateType.value === 'month') {
              return dayjs(value).format('YYYY-MM')
            }
          }
        },
      },
    }
  )

  const getChartData = async () => {
    setLoading(true)
    const {
      response: {
        value: { data },
      },
    } = await getAccessTrend({
      type: dateType.value,
      startTime: date.value && date.value[0],
      endTime: date.value && date.value[1],
    })
    setLoading(false)
    chartData.value = data
  }

  const changDateType = () => {
    if (dateType.value === 'week') {
      date.value = [dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()]
    } else if (dateType.value === 'month') {
      date.value = [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()]
    }
    getChartData()
  }

  onMounted(() => {
    getChartData()
  })
</script>

<style lang="scss" scoped>
  .card-title {
    height: 1.4375rem;
  }
</style>
