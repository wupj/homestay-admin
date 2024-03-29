import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'
import dayjs from 'dayjs'
import { ColumnProps } from 'primevue/column/Column'
import { unref } from 'vue'

/**
 * 延时执行
 * @param  {Number}   ms    等待时间
 */
export const sleep = (ms: number = 500) => {
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
export const toFixed = (value: any, bit: number = 0) => {
  const times = 10 ** bit
  let result = value * times + 0.5
  result = parseInt(String(result), 10) / times
  return result
}

/**
 * 获取文件后缀
 * @param  {String}   fileUrl   原始值
 */
export const getFileSuffix = (fileUrl: string) => {
  if (!fileUrl) return
  return fileUrl.substring(fileUrl.lastIndexOf('.') + 1)
}

/**
 * 生成路由
 * @param  {String}   menus   菜单
 */
export const generateRoute = (menus: []) => {
  if (!menus.length) return
  const modules = import.meta.glob('@/views/**/*.vue')
  menus.forEach((menu: any) => {
    if (menu.children) {
      menu.children = generateRoute(menu.children)
    }
    if (menu.component && !menu.children) {
      menu.component = modules[`/src/views${menu.component}.vue`]
    }
    menu.meta = {
      label: menu.label,
    }
  })
  return menus
}

/**
 * 导出表格数据
 * @param  {Array}      columns      导出的列
 * @param  {Array}      data         导出的数据
 * @param  {String}     fileName     文件名字
 */
export const exportExcel = async (columns: any[], data: any[], fileName?: string) => {
  const filterFields = ['operate']
  // 过滤掉不需要导出的列
  const exportColumns = unref(columns).filter((item: ColumnProps) => {
    // @ts-ignore
    return !filterFields.includes(item.field)
  })
  // 表格的宽度
  const tableWidth = exportColumns.length * 20
  const headers = exportColumns.map((item: ColumnProps) => {
    // @ts-ignore
    const width = (parseInt(item.width, 10) / 100) * tableWidth || 20
    return {
      header: item.header,
      key: item.field,
      width,
    }
  })
  // 创建工作簿
  const workbook = new Workbook()
  // 添加sheet
  const worksheet = workbook.addWorksheet('Sheet1')
  // 设置列
  // @ts-ignore
  worksheet.columns = headers
  // 给表头添加背景色
  const headerRow = worksheet.getRow(1)
  // 精准设置表头样式
  headerRow.eachCell((cell, colNum) => {
    // cell.alignment = { vertical: 'middle', horizontal: 'center' }
    // 设置背景色
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f9fafb' },
    }
    // 设置字体
    cell.font = {
      size: 12,
      name: '微软雅黑',
      color: { argb: '374151' },
    }
    // 设置网格线
    cell.border = {
      top: { style: 'thin', color: { argb: 'e5e7eb' } },
      left: { style: 'thin', color: { argb: 'e5e7eb' } },
      bottom: { style: 'thin', color: { argb: 'e5e7eb' } },
      right: { style: 'thin', color: { argb: 'e5e7eb' } },
    }
  })
  // 添加行
  worksheet.addRows(data)
  // 导出excel
  const blobData = await workbook.xlsx.writeBuffer()
  const blob = new Blob([blobData], {
    type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  await saveAs(blob, `${fileName || dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}.xlsx`)
}
