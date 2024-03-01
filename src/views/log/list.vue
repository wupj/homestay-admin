<template>
  <div class="container">
    <Card>
      <template #content>
        <div class="flex justify-content-start align-items-center">
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('log.operateAccount') }}</label>
            <Dropdown
              class="w-12rem"
              v-model="queryForm.userName"
              :options="userOpt"
              :virtualScrollerOptions="{ itemSize: 38 }"
              optionLabel="accountName"
              optionValue="accountName"
              :placeholder="$t('log.selectOperateAccount')"
            />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('log.operateModule') }}</label>
            <InputText
              type="text"
              v-model="queryForm.operateModule"
              :placeholder="$t('log.enterOperateModule')"
            />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('log.operateAccount') }}</label>
            <InputText
              type="text"
              v-model="queryForm.ipAddress"
              :placeholder="$t('log.enterIpAddress')"
            />
          </div>

          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('log.operateTime') }}</label>
            <Calendar
              v-model="queryForm.date"
              selectionMode="range"
              dateFormat="yy-mm-dd "
              :placeholder="$t('coupon.selectTimePeriod')"
              :manualInput="false"
              showIcon
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
    <Card class="mt-4">
      <template #content>
        <Table
          dataKey="logId"
          :loading="loading"
          :columns="tableColumn"
          :tableData="tableData"
          :pagination="pagination"
          @page="handlePage"
          @export="handleExport"
          showSerial
        />
      </template>
    </Card>
  </div>
</template>

<script lang="tsx" setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Table from '@/components/basic/table'
  import { getUserList, getLogLost } from '@/api'
  import { exportExcel } from '@/utils'

  const { t } = useI18n()

  const queryForm = ref({
    userName: '',
    operateModule: '',
    ipAddress: '',
    date: undefined,
  })

  const queryParams = ref({
    userName: '',
    operateModule: '',
    ipAddress: '',
    startTime: undefined,
    endTime: undefined,
  })

  const loading = ref(false)
  const pagination = ref({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  })
  const userOpt = ref([])
  const tableColumn = ref([
    {
      field: 'accountName',
      header: t('log.operateAccount'),
      sortable: true,
    },
    {
      field: 'operateModule',
      header: t('log.operateModule'),
      sortable: true,
    },
    {
      field: 'operateRecord',
      header: t('log.operateRecord'),
      class: 'w-5',
    },
    {
      field: 'ipAddress',
      header: t('log.ipAddress'),
      sortable: true,
    },
    {
      field: 'operateTime',
      header: t('log.operateTime'),
      sortable: true,
    },
  ])
  const tableData = ref([])

  const getUserData = async () => {
    const {
      response: {
        value: { data },
      },
    } = await getUserList()
    userOpt.value = data
  }

  const getTableData = async () => {
    loading.value = true
    const {
      response: {
        value: { data, total },
      },
    } = await getLogLost({
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

  const handleExport = async () => {
    const {
      response: {
        value: { data },
      },
    } = await getLogLost(queryParams.value)
    await exportExcel(tableColumn.value, data)
  }

  onMounted(() => {
    getUserData()
    getTableData()
  })
</script>

<style scoped></style>
