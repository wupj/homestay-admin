<template>
  <div class="container">
    <Card>
      <template #content>
        <div class="flex justify-content-start align-items-center">
          <div class="field mr-4">
            <label class="font-semibold mr-2">民宿名称</label>
            <InputText type="text" v-model="queryForm.homestayName" placeholder="请输入民宿名称" />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">订单编号</label>
            <InputText type="text" v-model="queryForm.orderNo" placeholder="请输入订单编号" />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">支付方式</label>
            <EnumSelect
              v-model="queryForm.paymentMode"
              enumType="paymentMode"
              placeholder="请选择支付方式"
            />
          </div>
          <div class="field">
            <Button class="mr-2" icon="pi pi-search" label="查询" @click="handleSearch" />
            <Button icon="pi pi-refresh" severity="warning" label="重置" @click="handleReset" />
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
          showCheckbox
        />
      </template>
    </Card>
  </div>
</template>

<script lang="tsx" setup>
  import { ref, onMounted } from 'vue'
  import EnumSelect from '@/components/business/enum-select'
  import Table from '@/components/basic/table'
  import { getOrderList } from '@/api'
  import { getEnumLabel } from '@/utils/enums'

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

  const loading = ref(false)
  const pagination = ref({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  })

  const tableColumn = ref([
    {
      field: 'orderNo',
      header: '订单编号',
      sortable: true,
    },
    {
      field: 'orderTime',
      header: '下单时间',
      sortable: true,
    },
    {
      field: 'userAccount',
      header: '用户名称',
      sortable: true,
    },
    {
      field: 'phone',
      header: '手机号码',
      sortable: true,
    },
    {
      field: 'homestayName',
      header: '民宿名称',
      sortable: true,
    },
    {
      field: 'address',
      header: '地址',
      class: 'w-2',
    },
    {
      field: 'orderAmount',
      header: '订单金额（元）',
      sortable: true,
    },
    {
      field: 'paymentMode',
      header: '支付方式',
      sortable: true,
      render: ({ data }) => {
        return <span>{getEnumLabel('paymentMode', data.paymentMode)}</span>
      },
    },
    {
      field: 'orderState',
      header: '订单状态',
      sortable: true,
      render: ({ data }) => {
        return <span>{getEnumLabel('orderState', data.orderState)}</span>
      },
    },
    {
      field: 'operate',
      header: '操作',
      render: ({ data }) => {
        return (
          <div>
            <Button class="p-0" label="详情" text onClick={() => handleDetail(data)} />
            <Button
              class="p-0 ml-4"
              label="入住"
              severity="info"
              text
              onClick={() => handleCheck(data)}
            />
            <Button
              class="p-0 ml-4"
              label="取消"
              severity="warning"
              text
              onClick={() => handleCancel(data)}
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
      label: '全部',
    },
    {
      key: 1,
      label: '待支付',
    },
    {
      key: 2,
      label: '已确认',
    },
    {
      key: 3,
      label: '已入住',
    },
    {
      key: 4,
      label: '退款中',
    },
    {
      key: 5,
      label: '待评价',
    },
    {
      key: 6,
      label: '已完成',
    },
    {
      key: 7,
      label: '已取消',
    },
  ])
  const selectRow = ref([])

  const getTableData = async () => {
    loading.value = true
    const {
      response: {
        value: { data, total },
      },
    } = await getOrderList({
      pageIndex: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize,
      ...queryParams.value,
    })
    loading.value = false
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
    console.log(row)
  }

  const handleCheck = (row) => {
    console.log(row)
  }

  const handleCancel = (row) => {
    console.log(row)
  }

  onMounted(() => {
    getTableData()
  })
</script>

<style scoped></style>
