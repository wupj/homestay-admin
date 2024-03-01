<template>
  <Dialog
    v-model:visible="visible"
    :header="$t('role.configurePermissions')"
    :style="{ width: '40rem' }"
    :draggable="false"
    @hide="handleClose"
    modal
  >
    <div class="flex justify-content-start align-items-center">
      <Tree
        class="w-full"
        v-model:expandedKeys="expandAuth"
        v-model:selectionKeys="selectAuth"
        :loading="authLoading"
        :value="authTree"
        selectionMode="checkbox"
        filter="label"
        :filterPlaceholder="$t('common.search')"
      />
    </div>
    <template #footer>
      <Button
        class="mr-4"
        icon="pi pi-times"
        :label="$t('common.cancel')"
        @click="handleClose"
        text
        raised
      />
      <Button icon="pi pi-check" :label="$t('common.confirm')" @click="handleSubmit" />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
  import { ref, defineExpose } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'
  import { getAuthTree } from '@/api'

  const emit = defineEmits(['done'])

  const { t } = useI18n()
  const toast = useToast()

  const visible = ref(false)
  const authLoading = ref(false)
  const expandAuth = ref({
    0: true,
  })
  const selectAuth = ref(null)
  const authTree = ref([])

  const handleOpen = async (row: any) => {
    await getTreeData(row)
    selectAuth.value = selectNode(authTree.value)
    visible.value = true
  }

  const getTreeData = async (row: any) => {
    authLoading.value = true
    const { data } = await getAuthTree(row.roleNo)
    authLoading.value = false
    authTree.value = [data.value]
  }

  const selectNode = (data: any) => {
    let keys = {}
    data.forEach((item) => {
      keys[item.key] = {
        checked: true,
      }
      if (item.children) {
        keys = { ...keys, ...selectNode(item.children) }
      }
    })
    return keys
  }

  const handleClose = () => {
    visible.value = false
    selectAuth.value = null
  }

  const handleSubmit = async () => {
    console.log(selectAuth.value)
    toast.add({
      severity: 'success',
      detail: t('message.operationSuccessful'),
      life: 3000,
    })
    handleClose()
    emit('done')
  }

  defineExpose({
    handleOpen,
  })
</script>

<style scoped></style>
