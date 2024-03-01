<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'check' ? $t('order.checkInOperate') : $t('order.cancelOrder')"
    :style="{ width: '50rem' }"
    :draggable="false"
    @hide="handleClose"
    modal
  >
    <div class="flex justify-content-start align-items-center">
      <div class="form-field w-full flex justify-content-start">
        <div class="font-semibold mr-2"
          ><label class="is-required">{{
            operateType === 'check' ? $t('order.remarks') : $t('order.cancelReason')
          }}</label></div
        >
        <div class="flex-1 relative">
          <Textarea
            class="w-full"
            v-model="form.remark"
            rows="3"
            :placeholder="$t('message.pleaseEnterContentWithin100Words')"
          />
          <small class="block p-error text-base" v-if="errorFields?.remark?.length">{{
            errorFields.remark[0].message
          }}</small>
        </div>
      </div>
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
    <Toast position="center" />
  </Dialog>
</template>

<script lang="ts" setup>
  import { ref, defineExpose } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Toast from 'primevue/toast'
  import { useToast } from 'primevue/usetoast'
  import type { Rules } from 'async-validator'
  import useValidator from '@/hooks/useValidator'

  const emit = defineEmits(['done'])

  const { t } = useI18n()
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
        message: t('message.pleaseEnterContent'),
      },
      {
        max: 100,
        message: t('message.contentCannotExceed100Words'),
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
        detail: t('message.operationSuccessful'),
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
