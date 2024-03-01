<template>
  <div class="container">
    <Card>
      <template #content>
        <div class="flex justify-content-start align-items-center">
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('home.homestayName') }}</label>
            <InputText
              type="text"
              v-model="queryForm.homestayName"
              :placeholder="$t('order.enterHomestayName')"
            />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('order.orderNo') }}</label>
            <InputText
              type="text"
              v-model="queryForm.orderNo"
              :placeholder="$t('order.enterOrderNo')"
            />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('order.paymentMethod') }}</label>
            <EnumSelect
              v-model="queryForm.paymentMode"
              enumType="paymentMode"
              :placeholder="$t('order.selectPaymentMethod')"
            />
          </div>
          <div class="field">
            <Button
              class="mr-2"
              icon="pi pi-search"
              :label="$t('common.query')"
              @click="handleSearch"
            />
            <Button
              icon="pi pi-refresh"
              severity="warning"
              :label="$t('common.reset')"
              @click="handleReset"
            />
          </div>
        </div>
      </template>
    </Card>
    <TabMenu
      class="mt-4"
      v-model:activeIndex="queryParams.state"
      :model="stateTab"
      @tab-change="getTableData"
    />
    <Card class="mt-4">
      <template #content>
        <Table
          dataKey="orderId"
          v-model:selection="selectRow"
          :loading="loading"
          :columns="tableColumn"
          :tableData="tableData"
          :pagination="pagination"
          @page="handlePage"
          @export="handleExport"
          showCheckbox
        >
          <template #left>
            <Button
              icon="pi pi-trash"
              severity="danger"
              :label="$t('common.cancel')"
              :disabled="!selectRow.length"
              @click="handleOpenDialog('cancel')"
            />
          </template>
        </Table>
      </template>
    </Card>
    <Toast position="center" />
    <OrderDialog ref="dialogRef" @done="handleSearch" />
  </div>
</template>

<script lang="tsx" setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import Toast from 'primevue/toast'
  import EnumSelect from '@/components/business/enum-select'
  import Table from '@/components/basic/table'
  import OrderDialog from './widgets/order-dialog'
  import { getOrderList } from '@/api'
  import { getEnumLabel } from '@/utils/enums'
  import { exportExcel } from '@/utils'
  import useLoading from '@/hooks/useLoading'

  const router = useRouter()
  const { t } = useI18n()

  const queryForm = ref({
    homestayName: '',
    orderNo: '',
    paymentMode: '',
  })

  const queryParams = ref({
    homestayName: '',
    orderNo: '',
    paymentMode: '',
    state: undefined,
  })

  const [loading, setLoading] = useLoading(false)
  const pagination = ref({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  })

  const tableColumn = ref([
    {
      field: 'orderNo',
      header: t('order.orderNo'),
      sortable: true,
    },
    {
      field: 'orderTime',
      header: t('order.orderTime'),
      sortable: true,
    },
    {
      field: 'userAccount',
      header: t('order.userName'),
      sortable: true,
    },
    {
      field: 'phone',
      header: t('order.phone'),
      sortable: true,
    },
    {
      field: 'homestayName',
      header: t('home.homestayName'),
      sortable: true,
    },
    {
      field: 'address',
      header: t('order.address'),
      class: 'w-2',
    },
    {
      field: 'orderAmount',
      header: `${t('order.orderAmount')}(${t('home.dollar')})`,
      sortable: true,
    },
    {
      field: 'paymentMode',
      header: t('order.paymentMethod'),
      sortable: true,
      render: ({ data }) => {
        return <span>{getEnumLabel('paymentMode', data.paymentMode)}</span>
      },
    },
    {
      field: 'orderState',
      header: t('order.orderState'),
      sortable: true,
      render: ({ data }) => {
        return <span>{getEnumLabel('orderState', data.orderState)}</span>
      },
    },
    {
      field: 'operate',
      header: t('common.operate'),
      class: 'w-2',
      render: ({ data }) => {
        return (
          <div>
            <Button
              class="p-0"
              label={t('common.detail')}
              text
              onClick={() => handleDetail(data)}
            />
            <Button
              class="p-0 ml-4"
              label={t('order.checkIn')}
              severity="info"
              text
              onClick={() => handleOpenDialog('check', data)}
            />
            <Button
              class="p-0 ml-4"
              label={t('common.cancel')}
              severity="warning"
              text
              onClick={() => handleOpenDialog('cancel', data)}
            />
          </div>
        )
      },
    },
  ])
  const tableData = ref([])
  const stateTab = ref([
    {
      key: 0,
      label: t('common.all'),
    },
    {
      key: 1,
      label: t('home.toBePaid'),
    },
    {
      key: 2,
      label: t('home.confirmed'),
    },
    {
      key: 3,
      label: t('enums.checkedIn'),
    },
    {
      key: 4,
      label: t('home.refundProgress'),
    },
    {
      key: 5,
      label: t('enums.toBeEvaluated'),
    },
    {
      key: 6,
      label: t('enums.completed'),
    },
    {
      key: 7,
      label: t('enums.canceled'),
    },
  ])
  const selectRow = ref([])
  const dialogRef = ref()

  const getTableData = async () => {
    setLoading(true)
    const {
      response: {
        value: { data, total },
      },
    } = await getOrderList({
      pageIndex: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize,
      ...queryParams.value,
    })
    setLoading(false)
    tableData.value = data
    pagination.value.total = total
  }

  const handlePage = ({ page, rows }) => {
    pagination.value.pageIndex = page + 1
    pagination.value.pageSize = rows
    getTableData()
  }

  const handleSearch = () => {
    pagination.value.pageIndex = 1
    Object.keys(queryForm.value).forEach((key) => {
      queryParams.value[key] = queryForm.value[key]
    })
    getTableData()
  }

  const handleReset = () => {
    Object.keys(queryForm.value).forEach((key) => {
      queryForm.value[key] = ''
    })
    handleSearch()
  }

  const handleDetail = (row) => {
    router.push(`/order/detail/${row.orderId}`)
  }

  const handleOpenDialog = (type, row) => {
    dialogRef.value.handleOpen(type, row)
  }

  const handleExport = async () => {
    const {
      response: {
        value: { data },
      },
    } = await getOrderList(queryParams.value)
    await exportExcel(tableColumn.value, data)
  }

  onMounted(() => {
    getTableData()
  })
</script>

<style scoped></style>
