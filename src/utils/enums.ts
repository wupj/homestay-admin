// 支付方式
export const paymentMode = [
  {
    label: '微信支付',
    value: 0,
  },
  {
    label: '支付宝支付',
    value: 1,
  },
  {
    label: '网银支付',
    value: 2,
  },
]

// 租房类型
export const rentType = [
  {
    label: '钟点房',
    value: 0,
  },
  {
    label: '日租',
    value: 1,
  },
  {
    label: '月租',
    value: 2,
  },
  {
    label: '年租',
    value: 3,
  },
]

// 民宿标签
export const homestayTag = [
  {
    label: '旅游',
    value: 0,
  },
  {
    label: '居家',
    value: 1,
  },
  {
    label: '放松',
    value: 2,
  },
  {
    label: '休闲',
    value: 3,
  },
]

// 优惠券领取方式
export const pickupMode = [
  {
    label: '新注册用户',
    value: 0,
  },
  {
    label: '好友邀请',
    value: 1,
  },
  {
    label: '限时领取',
    value: 2,
  },
]

// 订单状态
export const orderState = [
  {
    label: '待支付',
    value: 1,
  },
  {
    label: '已确认',
    value: 2,
  },
  {
    label: '已入住',
    value: 3,
  },
  {
    label: '退款中',
    value: 4,
  },
  {
    label: '待评价',
    value: 5,
  },
  {
    label: '已完成',
    value: 6,
  },
  {
    label: '已取消',
    value: 7,
  },
]

const enums = {
  paymentMode,
  rentType,
  homestayTag,
  pickupMode,
  orderState,
}

export const getEnumLabel = (enumType, value: number) => {
  return enums[enumType]?.find((item) => item.value === value)?.label
}

export const getEnum = (enumType: string, showAll?: boolean, filterValue?: Array<number>) => {
  const list = enums[enumType]
  showAll && list?.unshift({ label: '全部', value: undefined })
  return list.filter((o) => !filterValue?.includes(o.value))
}

export default enums
