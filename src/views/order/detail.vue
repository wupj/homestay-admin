<template>
  <div class="container">
    <Button class="mb-4" label="返回" icon="pi pi-arrow-left" @click="handleBack" />
    <Card class="mb-4">
      <template #content>
        <div class="card-title mb-3">订单信息</div>
        <div class="flex justify-content-start align-items-center flex-wrap">
          <div class="field w-6" v-for="(item, index) in orderArr" :key="index">
            <label class="w-3 pr-6 text-right font-semibold">{{ item.label }}</label>
            <label class="w-9 text-left" v-if="item.field === 'paymentMode'">{{
              getEnumLabel('paymentMode', detailData[item.field])
            }}</label>
            <label
              class="w-9 text-left"
              v-else-if="['orderAmount', 'discountAmount', 'paidAmount'].includes(item.field)"
              >¥ {{ detailData[item.field] }}</label
            >
            <label class="w-9 text-left" v-else>{{ detailData[item.field] }}</label>
          </div>
        </div>
      </template>
    </Card>
    <Card class="mb-4">
      <template #content>
        <div class="card-title mb-3">民宿信息</div>
        <div class="flex justify-content-start align-items-center flex-wrap">
          <div class="field w-6" v-for="(item, index) in homestayArr" :key="index">
            <label class="w-3 pr-6 text-right font-semibold">{{ item.label }}</label>
            <label class="w-9 text-left" v-if="item.field === 'rentType'">{{
              getEnumLabel('rentType', detailData[item.field])
            }}</label>
            <label
              class="w-9 text-left"
              v-else-if="['antecedentMoney', 'rent'].includes(item.field)"
              >¥ {{ detailData[item.field] }}</label
            >
            <label class="w-9 text-left" v-else-if="item.field === 'pictureVideo'">
              <video
                class="vertical-align-top"
                v-if="getFileSuffix(detailData[item.field]) === ''"
                :src="detailData[item.field]"
                width="120"
                height="80"
                controls
              />
              <Image
                v-else
                class="vertical-align-top"
                :src="detailData[item.field]"
                width="80"
                height="80"
                preview
              />
            </label>
            <label class="w-9 text-left" v-else>{{ detailData[item.field] }}</label>
          </div>
        </div>
      </template>
    </Card>
    <Card class="mb-4">
      <template #content>
        <div class="card-title mb-3">买家信息</div>
        <div class="flex justify-content-start align-items-center flex-wrap">
          <div class="field w-6" v-for="(item, index) in userArr" :key="index">
            <label class="w-3 pr-6 text-right font-semibold">{{ item.label }}</label>
            <label class="w-9 text-left" v-if="item.field === 'orderMethod'">{{
              getEnumLabel('orderMethod', detailData[item.field])
            }}</label>
            <label class="w-9 text-left" v-else>{{ detailData[item.field] }}</label>
          </div>
        </div>
      </template>
    </Card>
    <Card class="mb-4">
      <template #content>
        <div class="card-title mb-3">订单记录</div>
        <Timeline class="order-record" :value="detailData.orderRecords">
          <template #content="scope">
            <div class="line-height-3 text-lg font-semibold">{{ scope.item.recordTitle }}</div>
            <div class="line-height-3">
              <span class="mr-6">{{ scope.item.recordTime }}</span>
              <span class="">{{ scope.item.recordExplain }}</span>
            </div>
          </template>
        </Timeline>
      </template>
    </Card>
    <Loading :loading="loading" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getOrderDetail } from '@/api'
  import { getEnumLabel } from '@/utils/enums'
  import { getFileSuffix } from '@/utils'

  const route = useRoute()
  const router = useRouter()

  const orderArr = ref([
    {
      field: 'orderNo',
      label: '订单编号',
    },
    {
      field: 'orderTime',
      label: '下单时间',
    },
    {
      field: 'paymentMode',
      label: '付款方式',
    },
    {
      field: 'paymentTime',
      label: '付款时间',
    },
    {
      field: 'giveIntegral',
      label: '赠送积分',
    },
    {
      field: 'orderAmount',
      label: '订单金额',
    },
    {
      field: 'discountAmount',
      label: '优惠金额',
    },
    {
      field: 'paidAmount',
      label: '实付金额',
    },
  ])
  const homestayArr = ref([
    {
      field: 'homestayName',
      label: '民宿名称',
    },
    {
      field: 'address',
      label: '详细地址',
    },
    {
      field: 'rentType',
      label: '出租类型',
    },
    {
      field: 'antecedentMoney',
      label: '押金',
    },
    {
      field: 'rent',
      label: '租金',
    },
    {
      field: 'moreInfo',
      label: '补充说明',
    },
    {
      field: 'pictureVideo',
      label: '图片视频',
    },
  ])
  const userArr = ref([
    {
      field: 'userAccount',
      label: '用户账号',
    },
    {
      field: 'contactAddress',
      label: '联系地址',
    },
    {
      field: 'orderMethod',
      label: '下单方式',
    },
    {
      field: 'remarks',
      label: '备注内容',
    },
  ])

  const loading = ref(false)
  const detailData = ref({})

  const getDetailData = async () => {
    loading.value = true
    const {
      response: {
        value: { data },
      },
    } = await getOrderDetail({
      orderId: route.params.id,
    })
    detailData.value = data
    loading.value = false
  }

  watch(
    () => route.params.id,
    () => {
      getDetailData()
    },
    {
      immediate: true,
    }
  )

  const handleBack = () => {
    router.push('/order/list')
  }
</script>

<style lang="scss" scoped>
  .order-record {
    ::v-deep(.p-timeline-event-opposite) {
      display: none;
    }
  }
</style>
