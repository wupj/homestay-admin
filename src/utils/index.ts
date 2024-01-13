/**
 * 延时执行
 * @param  {Number}   ms    等待时间
 */
export const sleep = (ms = 500) => {
  if (typeof ms !== 'number') {
    throw new Error('param must be a number')
  }
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * 四舍五入
 * @param  {Number}   value   原始值
 * @param  {Number}   bit     保留位数
 */
export const toFixed = (value: any, bit = 0) => {
  const times = 10 ** bit
  let result = value * times + 0.5
  result = parseInt(String(result), 10) / times
  return result
}
