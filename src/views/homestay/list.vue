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
            <label class="font-semibold mr-2">{{ $t('homestay.rentType') }}</label>
            <EnumSelect
              v-model="queryForm.rentType"
              enumType="rentType"
              :placeholder="$t('homestay.selectRentType')"
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
          dataKey="homestayId"
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
              :label="$t('common.delete')"
              :disabled="!selectRow.length"
              @click="handleDelete(null)"
            />
          </template>
          <template #right>
            <Button icon="pi pi-plus" :label="$t('common.add')" @click="handleEdit(null)" />
          </template>
        </Table>
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
  import EnumSelect from '@/components/business/enum-select'
  import Table from '@/components/basic/table'
  import AddDialog from './widgets/add-dialog'
  import { getHomestayList } from '@/api'
  import { getEnumLabel } from '@/utils/enums'
  import { exportExcel } from '@/utils'

  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()

  const queryForm = ref({
    homestayName: '',
    rentType: undefined,
  })

  const queryParams = ref({
    homestayName: '',
    rentType: undefined,
  })

  const loading = ref(false)
  const pagination = ref({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  })

  const tableColumn = ref([
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
      field: 'rentType',
      header: t('homestay.rentType'),
      sortable: true,
      render: ({ data }) => {
        return <span>{getEnumLabel('rentType', data.rentType)}</span>
      },
    },
    {
      field: 'antecedentMoney',
      header: `${t('home.antecedentMoney')}(${t('home.dollar')})`,
      sortable: true,
    },
    {
      field: 'rent',
      header: `${t('order.rent')}(${t('home.dollar')})`,
      sortable: true,
    },
    {
      field: 'thumb',
      header: t('homestay.thumb'),
      sortable: true,
      render: ({ data }) => {
        return <Image src={data.thumb} width="50" height="50" preview />
      },
    },
    {
      field: 'describe',
      header: t('homestay.homestayDescribe'),
      class: 'w-2',
    },
    {
      field: 'tag',
      header: t('homestay.tag'),
      class: 'w-1',
      render: ({ data }) => {
        const severity = ['', 'info', 'success', 'warning']
        return (
          <div>
            {data.tag.map((item, index) => (
              <Tag class={index && 'ml-2'} severity={severity[item.value]} value={item.label} />
            ))}
          </div>
        )
      },
    },
    {
      field: 'createdBy',
      header: t('homestay.creator'),
      sortable: true,
    },
    {
      field: 'isPut',
      header: t('homestay.release'),
      render: ({ data }) => {
        return <InputSwitch v-model={data.isPut} />
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
    } = await getHomestayList({
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
    } = await getHomestayList(queryParams.value)
    await exportExcel(tableColumn.value, data)
  }

  onMounted(() => {
    getTableData()
  })
</script>

<style scoped></style>
