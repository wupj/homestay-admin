<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'check' ? '入住操作' : '取消订单'"
    :style="{ width: '50rem' }"
    :draggable="false"
    @hide="handleClose"
    modal
  >
    <div class="flex justify-content-start align-items-center">
      <div class="form-field w-full flex justify-content-start">
        <div class="font-semibold mr-2"
          ><label class="is-required">{{
            operateType === 'check' ? '备注内容' : '取消理由'
          }}</label></div
        >
        <div class="flex-1 relative">
          <Textarea
            class="w-full"
            v-model="form.remark"
            rows="3"
            placeholder="请输入内容，100字以内"
          />
          <small class="block p-error text-base" v-if="errorFields?.remark?.length">{{
            errorFields.remark[0].message
          }}</small>
        </div>
      </div>
    </div>
    <template #footer>
      <Button class="mr-4" icon="pi pi-times" label="取消" @click="handleClose" text raised />
      <Button icon="pi pi-check" label="确定" @click="handleSubmit" />
    </template>
    <Toast position="center" />
  </Dialog>
</template>

<script lang="ts" setup>
  import { ref, defineExpose } from 'vue'
  import Toast from 'primevue/toast'
  import { useToast } from 'primevue/usetoast'
  import type { Rules } from 'async-validator'
  import useValidator from '@/hooks/useValidator'

  const emit = defineEmits(['done'])

  const toast = useToast()

  const visible = ref(false)
  const operateType = ref('')

  const form = ref({
    remark: '',
  })
  const rules: Rules = {
    remark: [
      {
        required: true,
        message: '请输入内容',
      },
      {
        max: 100,
        message: '内容不能超过100字',
      },
    ],
  }
  let { execute, errorFields, resetFields } = useValidator(form, rules)

  const handleOpen = (type: string, row: any) => {
    console.log(row)
    operateType.value = type
    visible.value = true
  }

  const handleClose = () => {
    visible.value = false
    form.value.remark = ''
    resetFields()
  }

  const handleSubmit = async () => {
    const { pass } = await execute()
    if (pass) {
      toast.add({
        severity: 'success',
        detail: '操作成功',
        life: 3000,
      })
      handleClose()
      emit('done')
    }
  }

  defineExpose({
    handleOpen,
  })
</script>

<style scoped></style>
