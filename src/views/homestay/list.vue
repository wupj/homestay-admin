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
            <label class="font-semibold mr-2">租房类型</label>
            <EnumSelect
              v-model="queryForm.rentType"
              enumType="rentType"
              placeholder="请选择租房类型"
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
              label="删除"
              :disabled="!selectRow.length"
              @click="handleDelete(null)"
            />
          </template>
          <template #right>
            <Button icon="pi pi-plus" label="添加" @click="handleEdit(null)" />
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
      header: '民宿名称',
      sortable: true,
    },
    {
      field: 'address',
      header: '地址',
      class: 'w-2',
    },
    {
      field: 'rentType',
      header: '租房类型',
      sortable: true,
      render: ({ data }) => {
        return <span>{getEnumLabel('rentType', data.rentType)}</span>
      },
    },
    {
      field: 'antecedentMoney',
      header: '押金（元）',
      sortable: true,
    },
    {
      field: 'rent',
      header: '租金（元）',
      sortable: true,
    },
    {
      field: 'thumb',
      header: '缩略图',
      sortable: true,
      render: ({ data }) => {
        return <Image src={data.thumb} width="50" height="50" preview />
      },
    },
    {
      field: 'describe',
      header: '民宿描述',
      class: 'w-2',
    },
    {
      field: 'tag',
      header: '标签',
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
      header: '创建人',
      sortable: true,
    },
    {
      field: 'isPut',
      header: '发布',
      render: ({ data }) => {
        return <InputSwitch v-model={data.isPut} />
      },
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
      header: '删除',
      message: '确认要删除吗?',
      acceptLabel: '确定',
      rejectLabel: '取消',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      rejectClass: 'p-button-raised p-button-text mr-4',
      accept: () => {
        toast.add({ severity: 'success', detail: '操作成功', life: 3000 })
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
