<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'add' ? $t('coupon.addCoupon') : $t('coupon.editCoupon')"
    :style="{ width: '40rem' }"
    :draggable="false"
    @hide="handleClose"
    modal
  >
    <div class="flex justify-content-start align-items-center">
      <form class="w-full">
        <div
          class="form-field w-full flex justify-content-start"
          :class="{ 'align-items-center': item.prop !== 'moreInfo' }"
          v-for="(item, index) in formArr"
          :key="index"
        >
          <div class="w-5rem text-right font-semibold mr-2"
            ><label :class="{ 'is-required': item.required }">{{ item.label }}</label></div
          >
          <div class="flex-1 relative">
            <div v-if="item.prop === 'hasOrderAmount'" class="w-full flex flex-wrap gap-3">
              <div class="flex align-items-center">
                <RadioButton
                  v-model="form[item.prop]"
                  inputId="hasOrderAmount1"
                  name="hasOrderAmount"
                  :value="false"
                />
                <label for="hasOrderAmount" class="ml-2">{{ $t('coupon.unrestricted') }}</label>
              </div>
              <div class="flex align-items-center">
                <RadioButton
                  v-model="form[item.prop]"
                  inputId="hasOrderAmount2"
                  name="hasOrderAmount"
                  :value="true"
                />
                <label for="hasOrderAmount2" class="ml-2"
                  >{{ $t('coupon.over')
                  }}<InputText
                    class="ml-2 mr-2"
                    type="text"
                    v-model="form.orderAmount"
                    :disabled="!form[item.prop]"
                    :placeholder="item.placeholder"
                  />{{ $t('coupon.available') }}</label
                >
              </div>
            </div>
            <MultiSelect
              v-else-if="item.prop === 'availableHomestay'"
              class="w-full"
              v-model="form[item.prop]"
              :options="homestayList"
              :placeholder="item.placeholder"
              :virtualScrollerOptions="{ itemSize: 40 }"
              :maxSelectedLabels="3"
              optionValue="homestayId"
              optionLabel="homestayName"
              display="chip"
              :filterPlaceholder="$t('order.enterHomestayName')"
              filter
            />
            <Calendar
              v-else-if="item.prop === 'time'"
              class="w-full"
              v-model="form[item.prop]"
              selectionMode="range"
              dateFormat="yy-mm-dd"
              :placeholder="item.placeholder"
              :manualInput="false"
              showIcon
            />
            <EnumSelect
              v-else-if="item.prop === 'pickupMode'"
              className="w-full"
              v-model="form[item.prop]"
              :enumType="item.enumType"
              :placeholder="item.placeholder"
            />
            <Textarea
              v-else-if="item.prop === 'moreInfo'"
              class="w-full"
              v-model="form[item.prop]"
              :placeholder="item.placeholder"
              rows="3"
            />
            <InputText
              v-else
              class="w-full"
              v-model="form[item.prop]"
              :placeholder="item.placeholder"
            />
            <small
              class="block p-error text-base"
              v-if="errorFields[item.prop] && errorFields[item.prop].length"
              >{{ errorFields[item.prop][0].message }}</small
            >
          </div>
        </div>
      </form>
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
  import { getHomestayList } from '@/api'
  import { Rules } from 'async-validator'
  import useValidator from '@/hooks/useValidator'
  import useLoading from '@/hooks/useLoading'

  const emit = defineEmits(['done'])

  const { t } = useI18n()
  const toast = useToast()
  const [homestayLoading, setHomestayLoading] = useLoading(false)

  const visible = ref(false)
  const operateType = ref('')
  const homestayList = ref([])
  const formArr = ref([
    {
      label: t('coupon.couponName'),
      prop: 'couponName',
      placeholder: t('coupon.enterCouponName'),
      required: true,
    },
    {
      label: t('coupon.nominalValue'),
      prop: 'nominalValue',
      placeholder: t('coupon.enterNominalValue'),
      required: true,
    },
    {
      label: t('order.orderAmount'),
      prop: 'hasOrderAmount',
      placeholder: t('coupon.enterOrderAmount'),
      required: true,
    },
    {
      label: t('coupon.releasedQuantity'),
      prop: 'releasedQuantity',
      placeholder: t('coupon.enterReleasedQuantity'),
      required: true,
    },
    {
      label: t('coupon.applicableHomestay'),
      prop: 'availableHomestay',
      placeholder: t('coupon.selectApplicableHomestay'),
      required: false,
    },
    {
      label: t('coupon.expiryDate'),
      prop: 'time',
      placeholder: t('coupon.selectExpiryDate'),
      required: true,
    },
    {
      label: t('coupon.pickupMode'),
      prop: 'pickupMode',
      enumType: 'pickupMode',
      placeholder: t('coupon.selectPickupMode'),
      required: true,
    },
    {
      label: t('order.moreInfo'),
      prop: 'moreInfo',
      placeholder: t('coupon.enterMoreInfo'),
      required: false,
    },
  ])
  const form = ref({
    couponName: '',
    nominalValue: '',
    hasOrderAmount: false,
    orderAmount: '',
    releasedQuantity: '',
    availableHomestay: [],
    time: [],
    pickupMode: '',
    moreInfo: '',
  })
  const rules: Rules = {
    couponName: {
      required: true,
      message: t('coupon.enterCouponName'),
    },
    nominalValue: {
      required: true,
      message: t('coupon.enterNominalValue'),
    },
    hasOrderAmount: {
      required: true,
      validator: (rule, value, callback) => {
        if (value && form.value.orderAmount.trim() === '') {
          callback(new Error(t('coupon.enterOrderAmount')))
        }
        callback()
      },
    },
    releasedQuantity: {
      required: true,
      message: t('coupon.enterReleasedQuantity'),
    },
    time: {
      required: true,
      message: t('coupon.selectExpiryDate'),
    },
    pickupMode: {
      required: true,
      message: t('coupon.selectPickupMode'),
    },
  }

  const { execute, errorFields, resetFields } = useValidator(form, rules)

  const handleOpen = (row: any) => {
    operateType.value = row ? 'edit' : 'add'
    if (row) {
      Object.keys(form.value).forEach((key) => {
        form.value[key] = row[key]
      })
      form.value.hasOrderAmount = !!row.orderAmount
      form.value.availableHomestay = []
      if (row.effectiveTime && row.failureTime) {
        form.value.time = [new Date(row.effectiveTime), new Date(row.failureTime)]
      }
    }
    getHomestayData()
    visible.value = true
  }

  const getHomestayData = async () => {
    setHomestayLoading(true)
    const {
      response: {
        value: { data },
      },
    } = await getHomestayList()
    setHomestayLoading(false)
    homestayList.value = data
  }

  const handleClose = () => {
    visible.value = false
    Object.keys(form.value).forEach((key) => {
      form.value[key] = ''
    })
    resetFields()
  }

  const handleSubmit = async () => {
    if (!form.value.hasOrderAmount) {
      form.value.orderAmount = ''
    }
    form.value.effectiveTime = form.value?.time[0]
    form.value.failureTime = form.value?.time[1]
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

<style lang="scss" scoped></style>
