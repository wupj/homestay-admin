<template>
  <div class="container">
    <Button class="mb-4" :label="$t('common.return')" icon="pi pi-arrow-left" @click="handleBack" />
    <Card class="mb-4">
      <template #content>
        <div class="card-title mb-3">{{ $t('order.orderInfo') }}</div>
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
        <div class="card-title mb-3">{{ $t('order.homestayInfo') }}</div>
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
        <div class="card-title mb-3">{{ $t('order.buyerInfo') }}</div>
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
        <div class="card-title mb-3">{{ $t('order.orderRecords') }}</div>
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
  import { useI18n } from 'vue-i18n'
  import { getOrderDetail } from '@/api'
  import { getEnumLabel } from '@/utils/enums'
  import { getFileSuffix } from '@/utils'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const orderArr = ref([
    {
      field: 'orderNo',
      label: t('order.orderNo'),
    },
    {
      field: 'orderTime',
      label: t('order.orderTime'),
    },
    {
      field: 'paymentMode',
      label: t('order.paymentMode'),
    },
    {
      field: 'paymentTime',
      label: t('order.paymentTime'),
    },
    {
      field: 'giveIntegral',
      label: t('order.giveIntegral'),
    },
    {
      field: 'orderAmount',
      label: t('order.orderAmount'),
    },
    {
      field: 'discountAmount',
      label: t('order.discountAmount'),
    },
    {
      field: 'paidAmount',
      label: t('order.paidAmount'),
    },
  ])
  const homestayArr = ref([
    {
      field: 'homestayName',
      label: t('home.homestayName'),
    },
    {
      field: 'address',
      label: t('order.detailAddress'),
    },
    {
      field: 'rentType',
      label: t('order.rentType'),
    },
    {
      field: 'antecedentMoney',
      label: t('home.antecedentMoney'),
    },
    {
      field: 'rent',
      label: t('order.rent'),
    },
    {
      field: 'moreInfo',
      label: t('order.moreInfo'),
    },
    {
      field: 'pictureVideo',
      label: t('order.pictureVideo'),
    },
  ])
  const userArr = ref([
    {
      field: 'userAccount',
      label: t('order.userAccount'),
    },
    {
      field: 'contactAddress',
      label: t('order.contactAddress'),
    },
    {
      field: 'orderMethod',
      label: t('order.orderMethod'),
    },
    {
      field: 'remarks',
      label: t('order.remarks'),
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
