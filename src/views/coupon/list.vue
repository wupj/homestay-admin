<template>
  <div class="container">
    <Card>
      <template #content>
        <div class="flex justify-content-start align-items-center">
          <div class="field mr-4">
            <label class="font-semibold mr-2">优惠券名称</label>
            <InputText type="text" v-model="queryForm.couponName" placeholder="请输入优惠券名称" />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">领取方式</label>
            <EnumSelect
              v-model="queryForm.pickupMode"
              enumType="pickupMode"
              placeholder="请选择领取方式"
            />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">时间段</label>
            <Calendar
              v-model="queryForm.date"
              selectionMode="range"
              dateFormat="yy-mm-dd "
              placeholder="请选择时间段"
              :manualInput="false"
              showIcon
            />
          </div>
          <div class="field">
            <Button class="mr-2" icon="pi pi-search" label="查询" @click="handleSearch" />
            <Button icon="pi pi-refresh" severity="warning" label="重置" @click="handleReset" />
          </div>
        </div>
      </template>
    </Card>
    <Card class="mt-4">
      <template #content>
        <Table
          dataKey="couponId"
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
  import { getCouponList } from '@/api'
  import { getEnumLabel, pickupMode } from '@/utils/enums'

  const queryForm = ref({
    couponName: '',
    pickupMode: undefined,
    date: undefined,
  })

  const queryParams = ref({
    couponName: '',
    pickupMode: undefined,
    startTime: undefined,
    endTime: undefined,
  })

  const loading = ref(false)
  const pagination = ref({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  })

  const tableColumn = ref([
    {
      field: 'couponName',
      header: '优惠券名称',
      sortable: true,
    },
    {
      field: 'nominalValue',
      header: '面值',
      sortable: true,
    },
    {
      field: 'orderAmount',
      header: '订单金额',
      sortable: true,
      render: ({ data }) => {
        if (!data.orderAmount) {
          return <span>不限制</span>
        }
        return <span>满{data.orderAmount}元</span>
      },
    },
    {
      field: 'pickupMode',
      header: '领取方式',
      sortable: true,
      render: ({ data }) => {
        return <span>{getEnumLabel('rentType', data.pickupMode)}</span>
      },
    },
    {
      field: 'releasedQuantity',
      header: '发放数量',
      sortable: true,
    },
    {
      field: 'availableHomestay',
      header: '可用民宿',
      sortable: true,
    },
    {
      field: 'effectiveTime',
      header: '生效时间',
      sortable: true,
    },
    {
      field: 'failureTime',
      header: '失效时间',
      sortable: true,
    },
    {
      field: 'createdBy',
      header: '创建人',
      sortable: true,
    },
    {
      field: 'operate',
      header: '操作',
      render: ({ data }) => {
        return (
          <div>
            <Button class="p-0" label="编辑" text onClick={() => handleEdit(data)} />
            <Button
              class="p-0 ml-4"
              label="删除"
              severity="warning"
              text
              onClick={() => handleDelete(data)}
            />
          </div>
        )
      },
    },
  ])
  const tableData = ref([])

  const selectRow = ref([])

  const getTableData = async () => {
    loading.value = true
    const {
      response: {
        value: { data, total },
      },
    } = await getCouponList({
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
      if (key !== 'date') {
        queryParams.value[key] = queryForm.value[key]
      }
    })
    if (queryForm.value?.date) {
      queryParams.value.startTime = queryForm.value?.date[0]
      queryParams.value.endTime = queryForm.value?.date[1]
    }
    getTableData()
  }

  const handleReset = () => {
    Object.keys(queryForm.value).forEach((key) => {
      queryForm.value[key] = ''
    })
    handleSearch()
  }

  const handleEdit = (row) => {
    console.log(row)
  }

  const handleDelete = (row) => {
    console.log(row)
  }

  onMounted(() => {
    getTableData()
  })
</script>

<style scoped></style>
