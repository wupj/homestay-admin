<template>
  <div class="container">
    <Card>
      <template #content>
        <div class="flex justify-content-start align-items-center">
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('user.account') }}</label>
            <InputText
              type="text"
              v-model="queryForm.accountName"
              :placeholder="$t('user.enterAccount')"
            />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('user.realName') }}</label>
            <InputText
              type="text"
              v-model="queryForm.userName"
              :placeholder="$t('user.enterRealName')"
            />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('user.state') }}</label>
            <Dropdown
              class="w-12rem"
              v-model="queryForm.state"
              :options="stateOpt"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('user.selectState')"
            />
          </div>
          <div class="field mr-4">
            <label class="font-semibold mr-2">{{ $t('role.createTime') }}</label>
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
          dataKey="accountId"
          v-model:selection="selectRow"
          :loading="loading"
          :columns="tableColumn"
          :tableData="tableData"
          :pagination="pagination"
          @page="handlePage"
          @export="handleExport"
          showCheckbox
          showSerial
          ><template #left>
            <Button
              icon="pi pi-trash"
              severity="danger"
              :label="$t('common.delete')"
              :disabled="!selectRow.length"
              @click="handleDelete(null)"
            />
          </template>
          <template #right>
            <Button
              icon="pi pi-plus"
              :label="$t('common.add')"
              @click="handleEdit(null)"
            /> </template
        ></Table>
      </template>
    </Card>
    <Toast position="center" />
    <ConfirmDialog class="w-20rem" :draggable="false" />
    <AddDialog ref="dialogRef" @done="handleSearch" />
  </div>
</template>

<script lang="tsx" setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Toast from 'primevue/toast'
  import ConfirmDialog from 'primevue/confirmdialog'
  import { useToast } from 'primevue/usetoast'
  import { useConfirm } from 'primevue/useconfirm'
  import Table from '@/components/basic/table'
  import AddDialog from './widgets/add-dialog'
  import { getUserList } from '@/api'
  import { exportExcel } from '@/utils'

  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()

  const queryForm = ref({
    accountName: '',
    userName: '',
    state: undefined,
    date: undefined,
  })

  const queryParams = ref({
    accountName: '',
    userName: '',
    state: undefined,
    startTime: undefined,
    endTime: undefined,
  })

  const loading = ref(false)
  const pagination = ref({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  })
  const stateOpt = ref([
    {
      label: t('user.enable'),
      value: true,
    },
    {
      label: t('user.disabled'),
      value: false,
    },
  ])
  const tableColumn = ref([
    {
      field: 'accountName',
      header: t('user.account'),
      sortable: true,
    },
    {
      field: 'userName',
      header: t('user.realName'),
      sortable: true,
    },
    {
      field: 'phone',
      header: t('order.phone'),
      sortable: true,
    },
    {
      field: 'email',
      header: t('user.email'),
      sortable: true,
    },
    {
      field: 'createdTime',
      header: t('role.createTime'),
      sortable: true,
    },
    {
      field: 'state',
      header: t('user.state'),
      render: ({ data }) => {
        return <InputSwitch v-model={data.state} />
      },
    },
    {
      field: 'operate',
      header: t('common.operate'),
      render: ({ data }) => {
        return (
          <div>
            <Button class="p-0" label={t('common.edit')} text onClick={() => handleEdit(data)} />
            <Button
              class="p-0 ml-4"
              label={t('common.delete')}
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
  const dialogRef = ref()

  const getTableData = async () => {
    loading.value = true
    const {
      response: {
        value: { data, total },
      },
    } = await getUserList({
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
    dialogRef.value.handleOpen(row)
  }

  const handleDelete = (row) => {
    console.log(row)
    confirm.require({
      header: t('common.delete'),
      message: t('message.confirmDelete'),
      acceptLabel: t('common.confirm'),
      rejectLabel: t('common.cancel'),
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      rejectClass: 'p-button-raised p-button-text mr-4',
      accept: () => {
        toast.add({ severity: 'success', detail: t('message.operationSuccessful'), life: 3000 })
        handleSearch()
      },
    })
  }

  const handleExport = async () => {
    const {
      response: {
        value: { data },
      },
    } = await getUserList(queryParams.value)
    await exportExcel(tableColumn.value, data)
  }

  onMounted(() => {
    getTableData()
  })
</script>

<style scoped></style>
