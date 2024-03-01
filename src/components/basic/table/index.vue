<template>
  <div class="flex justify-content-between mb-4">
    <div class="justify-content-start">
      <slot name="left" />
    </div>
    <div class="justify-content-center">
      <slot name="center" />
    </div>
    <div class="justify-content-end">
      <slot name="right" />
      <Button
        class="ml-4"
        icon="pi pi-download"
        v-tooltip.top="$t('common.export')"
        @click="handleExport"
        text
        raised
      />
    </div>
  </div>
  <DataTable
    :value="tableData"
    :paginator="paginator"
    :first="pagination.first"
    :rows="pagination.pageSize"
    :totalRecords="pagination.total"
    :rowsPerPageOptions="rowsPerPageOptions"
    :paginatorTemplate="paginatorTemplate"
    :rowHover="rowHover"
    :lazy="paginator"
    v-bind="$attrs"
  >
    <Column v-for="column in tableColumns" v-bind="column">
      <template v-if="column.headerRender" #header="scope">
        <component :is="column.headerRender(scope)" />
      </template>
      <template v-if="column.render" #body="scope">
        <component :is="column.render(scope)" />
      </template>
      <template v-if="column.footerRender" #footer="scope">
        <component :is="column.footerRender(scope)" />
      </template>
    </Column>
  </DataTable>
</template>

<script lang="tsx" setup>
  import { ref, unref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    columns: {
      type: Array,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
    showCheckbox: {
      type: Boolean,
    },
    selectionMode: {
      type: String,
      default: 'multiple',
    },
    showSerial: {
      type: Boolean,
      default: false,
    },
    paginator: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Object,
    },
    rowsPerPageOptions: {
      type: Array,
      default: () => [10, 20, 50],
    },
    paginatorTemplate: {
      type: String,
      default:
        'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown JumpToPageInput CurrentPageReport',
    },
    rowHover: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(['export'])

  const { t } = useI18n()

  const tableColumns = computed(() => {
    const columns = [...unref(props.columns)]
    if (props.showSerial) {
      columns.unshift({
        field: 'serial',
        header: t('common.serial'),
        class: 'w-4rem',
        render: ({ index }) => {
          return <span>{index + 1}</span>
        },
      })
    }
    if (props.showCheckbox) {
      columns.unshift({
        selectionMode: props.selectionMode,
        class: 'w-5rem',
      })
    }
    return columns
  })

  const exportLoading = ref(false)

  const handleExport = async () => {
    exportLoading.value = true
    await emit('export')
    exportLoading.value = false
  }
</script>

<style scoped></style>
