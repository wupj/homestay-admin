import { group } from 'lodash'

const line = {
  grid: {
    top: 15,
    left: '2%',
    right: 20,
    bottom: 30,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    appendToBody: true,
  },
  xAxis: {
    show: true,
    type: 'time',
  },
  yAxis: {
    show: true,
    type: 'value',
  },
  legend: {
    show: true,
    bottom: 0,
  },
  series: [
    {
      type: 'line',
      smooth: true,
    },
  ],
}

const bar = {
  grid: {
    top: 15,
    left: '2%',
    right: 20,
    bottom: 30,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    appendToBody: true,
  },
  xAxis: {
    show: true,
    type: 'category',
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    show: true,
    type: 'value',
  },
  legend: {
    show: true,
    bottom: 0,
  },
  series: [
    {
      type: 'bar',
    },
  ],
}

const pie = {
  grid: {
    top: 0,
    bottom: '5%',
    containLabel: true,
  },
  tooltip: {
    show: true,
    appendToBody: true,
    // formatter: '{b} : {c}%',
  },
  legend: {
    show: true,
    bottom: 0,
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '45%'],
    },
  ],
}

const baseOptions = { line, bar, pie }

export const getPieSeries = (baseOpt, baseData) => {
  let series = []
  const data = []
  const { chartType, group, radius, unit = '' } = baseOpt
  for (const key in baseData) {
    data.push({
      name: group.name[key],
      value: baseData[key],
    })
  }
  series.push({
    ...baseOptions[chartType].series[0],
    radius: radius ? ['45%', '65%'] : [0, '75%'],
    data,
  })
  return {
    ...baseOptions[chartType],
    tooltip: {
      ...baseOptions[chartType].tooltip,
      // formatter: `{b} : {c}${unit}`,
    },
    series,
  }
}

export const getSeries = (baseOpt, baseData) => {
  let series = []
  const { chartType, xAxisField, yAxisField, legendName, stack, type } = baseOpt
  const data = baseData.map((item) => {
    return {
      value:
        type !== 'horizontal'
          ? [item[xAxisField], item[yAxisField]]
          : [item[yAxisField], item[xAxisField]],
      itemData: item,
    }
  })
  const seriesOpt = {
    ...baseOptions[chartType].series[0],
    name: legendName,
    stack,
    data,
  }
  if (type === 'area') {
    seriesOpt.areaStyle = {}
  }
  let xAxis = baseOptions[chartType].xAxis
  let yAxis = baseOptions[chartType].yAxis
  if (chartType === 'bar' && type === 'horizontal') {
    xAxis = baseOptions[chartType].yAxis
    yAxis = baseOptions[chartType].xAxis
  }
  series.push(seriesOpt)
  return {
    ...baseOptions[chartType],
    xAxis,
    yAxis,
    series,
  }
}

export default baseOptions
