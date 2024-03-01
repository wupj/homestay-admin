import i18n from '@/locale'

// 支付方式
export const paymentMode = [
  {
    label: i18n.global.t('enums.weChatPayment'),
    value: 0,
  },
  {
    label: i18n.global.t('enums.alipayPayment'),
    value: 1,
  },
  {
    label: i18n.global.t('enums.eCurrencyPayment'),
    value: 2,
  },
]

// 租房类型
export const rentType = [
  {
    label: i18n.global.t('enums.clockRoom'),
    value: 0,
  },
  {
    label: i18n.global.t('enums.dailyRent'),
    value: 1,
  },
  {
    label: i18n.global.t('enums.monthlyRent'),
    value: 2,
  },
  {
    label: i18n.global.t('enums.annualRent'),
    value: 3,
  },
]

// 民宿标签
export const homestayTag = [
  {
    label: i18n.global.t('enums.travel'),
    value: 0,
  },
  {
    label: i18n.global.t('enums.living'),
    value: 1,
  },
  {
    label: i18n.global.t('enums.relax'),
    value: 2,
  },
  {
    label: i18n.global.t('enums.leisure'),
    value: 3,
  },
]

// 优惠券领取方式
export const pickupMode = [
  {
    label: i18n.global.t('enums.NewRegisteredUser'),
    value: 0,
  },
  {
    label: i18n.global.t('enums.friendInvitation'),
    value: 1,
  },
  {
    label: i18n.global.t('enums.limitedTimeCollection'),
    value: 2,
  },
]

// 订单状态
export const orderState = [
  {
    label: i18n.global.t('home.toBePaid'),
    value: 1,
  },
  {
    label: i18n.global.t('home.confirmed'),
    value: 2,
  },
  {
    label: i18n.global.t('enums.checkedIn'),
    value: 3,
  },
  {
    label: i18n.global.t('home.refundProgress'),
    value: 4,
  },
  {
    label: i18n.global.t('enums.toBeEvaluated'),
    value: 5,
  },
  {
    label: i18n.global.t('enums.completed'),
    value: 6,
  },
  {
    label: i18n.global.t('enums.canceled'),
    value: 7,
  },
]

// 下单方式
export const orderMethod = [
  {
    label: i18n.global.t('enums.appOrder'),
    value: 0,
  },
  {
    label: i18n.global.t('enums.mpOrder'),
    value: 1,
  },
  {
    label: i18n.global.t('enums.h5Order'),
    value: 2,
  },
  {
    label: i18n.global.t('enums.webOrder'),
    value: 3,
  },
]

const enums = {
  paymentMode,
  rentType,
  homestayTag,
  pickupMode,
  orderState,
  orderMethod,
}

export const getEnumLabel = (enumType, value: number) => {
  return enums[enumType]?.find((item) => item.value === value)?.label
}

export const getEnum = (enumType: string, showAll?: boolean, filterValue?: Array<number>) => {
  const list = enums[enumType]
  showAll && list?.unshift({ label: i18n.global.t('common.all'), value: undefined })
  return list.filter((o) => !filterValue?.includes(o.value))
}

export default enums
