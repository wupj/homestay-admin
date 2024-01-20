import { useAxios } from '@vueuse/integrations/useAxios'
import instance from '@/utils/request'

// 验证码
export function getCaptcha() {
  return useAxios('/api/common/getCaptcha', { method: 'get' }, instance)
}

// 获取菜单
export function getMenus() {
  return useAxios('/api/common/getMenus', { method: 'get' }, instance)
}

// 登录
export function login(data: unknown) {
  return useAxios('/api/login', { method: 'post', data }, instance)
}

// 行政区划
export function getAdministrativeDivisions() {
  return useAxios('/api/common/getAdministrativeDivisions', { method: 'get' }, instance)
}

// 经营概况
export function getManageProfile() {
  return useAxios('/api/overview/getManageProfile', { method: 'get' }, instance)
}

// 订单状态占比
export function getOrderStatusRatio() {
  return useAxios('/api/overview/getOrderStatusRatio', { method: 'get' }, instance)
}

// 访问量趋势
export function getAccessTrend(data: unknown) {
  return useAxios('/api/overview/getAccessTrend', { method: 'post', data }, instance)
}

// 用户画像
export function getUserPortrait() {
  return useAxios('/api/overview/getUserPortrait', { method: 'get' }, instance)
}

// 人群年龄占比
export function getCrowdAgeRatio() {
  return useAxios('/api/overview/getCrowdAgeRatio', { method: 'get' }, instance)
}

// 订单量排行榜
export function getOrderVolumeTop() {
  return useAxios('/api/overview/getOrderVolumeTop', { method: 'get' }, instance)
}

// 销售额排行榜
export function getSalesVolumeTop() {
  return useAxios('/api/overview/getSalesVolumeTop', { method: 'get' }, instance)
}

// 资金收入占比
export function getFundIncomeRatio() {
  return useAxios('/api/overview/getFundIncomeRatio', { method: 'get' }, instance)
}

// 订单列表
export function getOrderList(data: unknown) {
  return useAxios('/api/orderManage/getOrderList', { method: 'post', data }, instance)
}

// 订单详情
export function getOrderDetail(data: unknown) {
  return useAxios('/api/orderManage/getOrderDetail', { method: 'post', data }, instance)
}

// 民宿列表
export function getHomestayList(data: unknown) {
  return useAxios('/api/homestayManage/getHomestayList', { method: 'post', data }, instance)
}

// 优惠券列表
export function getCouponList(data: unknown) {
  return useAxios('/api/couponManage/getCouponList', { method: 'post', data }, instance)
}

// 角色列表
export function getRoleList(data: unknown) {
  return useAxios('/api/roleManage/getRoleList', { method: 'post', data }, instance)
}

// 用户列表
export function getUserList(data?: unknown) {
  return useAxios('/api/userManage/getUserList', { method: 'post', data }, instance)
}

// 日志列表
export function getLogLost(data: unknown) {
  return useAxios('/api/operateLog/getLogLost', { method: 'post', data }, instance)
}
