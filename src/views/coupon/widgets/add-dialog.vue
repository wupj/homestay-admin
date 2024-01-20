<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'add' ? '新增优惠券' : '编辑优惠券'"
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
                <label for="hasOrderAmount" class="ml-2">无限制</label>
              </div>
              <div class="flex align-items-center">
                <RadioButton
                  v-model="form[item.prop]"
                  inputId="hasOrderAmount2"
                  name="hasOrderAmount"
                  :value="true"
                />
                <label for="hasOrderAmount2" class="ml-2"
                  >满<InputText
                    class="ml-2 mr-2"
                    type="text"
                    v-model="form.orderAmount"
                    :disabled="!form[item.prop]"
                    :placeholder="item.placeholder"
                  />可用</label
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
              filterPlaceholder="请输入民宿名称"
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
            <!--<small
              class="block p-error text-base"
              v-if="errorFields[item.prop] && errorFields[item.prop].length"
              >{{ errorFields[item.prop][0].message }}</small
            >-->
          </div>
        </div>
      </form>
    </div>
    <template #footer>
      <Button class="mr-4" icon="pi pi-times" label="取消" @click="handleClose" text raised />
      <Button icon="pi pi-check" label="确定" @click="handleSubmit" />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
  import { ref, defineExpose } from 'vue'
  import { useToast } from 'primevue/usetoast'
  import { getHomestayList } from '@/api'

  const emit = defineEmits(['done'])

  const toast = useToast()

  const visible = ref(false)
  const operateType = ref('')
  const homestayLoading = ref(false)
  const homestayList = ref([])
  const formArr = ref([
    {
      label: '优惠券名称',
      prop: 'couponName',
      placeholder: '请输入优惠券名称',
      required: true,
    },
    {
      label: '面值',
      prop: 'nominalValue',
      placeholder: '请输入面值',
      required: true,
    },
    {
      label: '订单金额',
      prop: 'hasOrderAmount',
      placeholder: '请输入订单金额',
      required: true,
    },
    {
      label: '发放数量',
      prop: 'releasedQuantity',
      placeholder: '请输入发放数量',
      required: true,
    },
    {
      label: '适用民宿',
      prop: 'availableHomestay',
      placeholder: '请选择适用民宿',
      required: false,
    },
    {
      label: '有效期',
      prop: 'time',
      placeholder: '请选择有效期',
      required: true,
    },
    {
      label: '领取方式',
      prop: 'pickupMode',
      enumType: 'pickupMode',
      placeholder: '请选择领取方式',
      required: true,
    },
    {
      label: '补充说明',
      prop: 'moreInfo',
      placeholder: '请输入补充说明',
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
    homestayLoading.value = true
    const {
      response: {
        value: { data },
      },
    } = await getHomestayList()
    homestayLoading.value = false
    homestayList.value = data
  }

  const handleClose = () => {
    visible.value = false
    Object.keys(form.value).forEach((key) => {
      form.value[key] = ''
    })
  }

  const handleSubmit = async () => {
    if (!form.value.hasOrderAmount) {
      form.value.orderAmount = ''
    }
    form.value.effectiveTime = form.value?.time[0]
    form.value.failureTime = form.value?.time[1]
    toast.add({
      severity: 'success',
      detail: '操作成功',
      life: 3000,
    })
    handleClose()
    emit('done')
  }

  defineExpose({
    handleOpen,
  })
</script>

<style lang="scss" scoped></style>
