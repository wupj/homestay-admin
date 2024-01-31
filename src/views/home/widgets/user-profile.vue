<template>
  <Card>
    <template #content>
      <div class="card-title">用户画像</div>
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
  import useLoading from '@/hooks/useLoading'
  import useEcharts from '@/hooks/useEcharts'
  import { getUserPortrait, getCrowdAgeRatio } from '@/api'

  const [loading, setLoading] = useLoading(false)
  const pieData = ref([])
  const [pieOptions] = useEcharts(
    {
      chartType: 'pie',
      radius: true,
      group: {
        name: {
          man: '男性',
          woman: '女性',
        },
      },
    },
    pieData,
    {
      title: {
        show: true,
        text: '客户性别占比',
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
      legendName: '人数',
    },
    barData,
    {
      title: {
        show: true,
        text: '人群年龄占比',
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
