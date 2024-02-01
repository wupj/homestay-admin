<template>
  <v-chart class="chart w-full h-full" :option="option" :theme="theme" autoresize />
</template>

<script lang="ts" setup>
  import useTheme from '@/hooks/useTheme'
  import VChart from 'vue-echarts'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { LineChart, BarChart, PieChart } from 'echarts/charts'
  import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DatasetComponent,
  } from 'echarts/components'
  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DatasetComponent,
  ])

  defineProps({
    option: {
      type: Object,
      required: true,
    },
  })

  const { theme } = useTheme()
</script>

<style lang="scss" scoped></style>
