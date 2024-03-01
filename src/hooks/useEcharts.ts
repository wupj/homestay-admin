import { ref, nextTick, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import { merge } from 'lodash'
import { getSeries, getPieSeries } from '@/utils/chart'

const useEcharts = (baseOpt: any, baseData: any, extraOpt: any = {}) => {
  const options = ref()

  const setOptions = (value: EChartsOption) => {
    options.value = value
  }

  watch(
    () => [baseOpt, baseData, extraOpt],
    () => {
      nextTick(() => {
        const series =
          baseOpt.chartType !== 'pie'
            ? getSeries(baseOpt, baseData.value)
            : getPieSeries(baseOpt, baseData.value)
        setOptions(merge({}, series, extraOpt))
      })
    },
    { immediate: true, deep: true }
  )

  return [options, setOptions]
}

export default useEcharts
