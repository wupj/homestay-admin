<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'check' ? '入住操作' : '取消订单'"
    :style="{ width: '50rem' }"
    :draggable="false"
    @hide="handleClose"
  >
    <div class="flex justify-content-start align-items-center">
      <div class="flex w-full field">
        <label class="font-semibold mr-2">{{
          operateType === 'check' ? '备注内容' : '取消理由'
        }}</label>
        <div class="flex-1">
          <Textarea
            class="w-full"
            v-model="remark"
            v-bind="remarkProps"
            rows="3"
            placeholder="请输入内容，100字以内"
          />
          <small class="block p-error mt-2 text-base" v-if="errors.remark">{{
            errors.remark
          }}</small>
        </div>
      </div>
    </div>
    <template #footer>
      <Button class="mr-4" icon="pi pi-times" label="取消" @click="handleClose" text raised />
      <Button icon="pi pi-check" label="确定" @click="clickSubmit" />
    </template>
    <Toast />
  </Dialog>
</template>

<script lang="ts" setup>
  import { ref, defineExpose } from 'vue'
  import { useToast } from 'primevue/usetoast'
  import { useForm } from 'vee-validate'

  const emit = defineEmits(['done'])

  const toast = useToast()
  const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: {
      remark: (value) => {
        if (!value) {
          return '请输入内容'
        }
        if (value.trim().length > 100) {
          return '内容不能超过100字'
        }
        return true
      },
    },
  })
  const [remark, remarkProps] = defineField('remark')

  const visible = ref(false)
  const operateType = ref('')

  const handleOpen = (type: string, row: any) => {
    console.log(row)
    operateType.value = type
    visible.value = true
  }

  const handleClose = () => {
    visible.value = false
    resetForm()
  }

  const clickSubmit = handleSubmit(() => {
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '操作成功',
      life: 3000,
    })
    handleClose()
    emit('done')
  })

  defineExpose({
    handleOpen,
  })
</script>

<style scoped></style>
