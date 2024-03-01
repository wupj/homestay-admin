<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'add' ? $t('homestay.addHomestay') : $t('homestay.editHomestay')"
    :style="{ width: '40rem' }"
    :draggable="false"
    @hide="handleClose"
    modal
  >
    <div class="flex justify-content-start align-items-center">
      <form class="w-full">
        <div
          class="form-field w-full flex justify-content-start"
          :class="{ 'align-items-center': !['describe', 'thumb'].includes(item.prop) }"
          v-for="(item, index) in formArr"
          :key="index"
        >
          <div class="w-5rem text-right font-semibold mr-2"
            ><label :class="{ 'is-required': item.required }">{{ item.label }}</label></div
          >
          <div class="flex-1 relative">
            <CascadeSelect
              v-if="item.prop === 'area'"
              class="w-full"
              v-model="form[item.prop]"
              :loading="areaLoading"
              :options="areaList"
              :optionGroupChildren="['children', 'children', 'children']"
              optionLabel="name"
              optionGroupLabel="name"
              @change="changArea"
              @group-change="changArea"
              :placeholder="item.placeholder"
            >
              <template #value="scope">
                <div class="flex align-items-center">
                  <span v-if="selectArea">{{ selectArea }}</span>
                  <span v-else>{{ item.placeholder }}</span>
                </div>
              </template>
            </CascadeSelect>
            <EnumSelect
              v-else-if="['rentType', 'tag'].includes(item.prop)"
              className="w-full"
              v-model="form[item.prop]"
              :enumType="item.enumType"
              :placeholder="item.placeholder"
              :multiple="item.prop === 'tag'"
            />
            <Textarea
              v-else-if="item.prop === 'describe'"
              class="w-full"
              v-model="form[item.prop]"
              :placeholder="item.placeholder"
              rows="3"
            />
            <FileUpload
              v-else-if="item.prop === 'thumb'"
              accept="image/*,video/*"
              :chooseLabel="$t('common.clickUpload')"
              :showUploadButton="false"
              :showCancelButton="false"
              @select="handleSelectFile"
              @remove="handleRemoveFile"
              customUpload
            >
              <template #empty>
                <div class="flex align-items-center justify-content-center flex-column">
                  <i
                    class="
                      pi pi-cloud-upload
                      border-2 border-circle
                      p-5
                      text-4xl text-400
                      border-400
                    "
                  />
                  <p class="mt-4 mb-0">{{ $t('common.dragAndDropFiles') }}</p>
                </div>
              </template>
            </FileUpload>
            <InputText
              v-else
              class="w-full"
              :class="{ 'money-input': ['antecedentMoney', 'rent'].includes(item.prop) }"
              v-model="form[item.prop]"
              :placeholder="item.placeholder"
            />
            <span class="unit ml-2" v-if="['antecedentMoney', 'rent'].includes(item.prop)">{{
              $t('home.dollar')
            }}</span>
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
  import type { Rules } from 'async-validator'
  import useValidator from '@/hooks/useValidator'
  import useLoading from '@/hooks/useLoading'
  import { getAdministrativeDivisions } from '@/api'

  const emit = defineEmits(['done'])

  const { t } = useI18n()
  const toast = useToast()
  const [areaLoading, setAreaLoading] = useLoading(false)

  const visible = ref(false)
  const operateType = ref('')
  const areaList = ref([])
  const selectArea = ref('')
  const selectAreaArr = ref([])
  const file = ref(null)
  const formArr = ref([
    {
      label: t('home.homestayName'),
      prop: 'homestayName',
      placeholder: t('order.enterHomestayName'),
      required: true,
    },
    {
      label: t('homestay.localArea'),
      prop: 'area',
      placeholder: t('homestay.selectLocalArea'),
      required: true,
    },
    {
      label: t('order.detailAddress'),
      prop: 'detailAddress',
      placeholder: t('homestay.enterDetailAddress'),
      required: false,
    },
    {
      label: t('homestay.rentType'),
      prop: 'rentType',
      enumType: 'rentType',
      placeholder: t('homestay.selectRentType'),
      required: true,
    },
    {
      label: t('home.antecedentMoney'),
      prop: 'antecedentMoney',
      placeholder: '请输入押金',
      required: false,
    },
    {
      label: t('order.rent'),
      prop: 'rent',
      placeholder: t('homestay.enterRent'),
      required: true,
    },
    {
      label: t('homestay.tag'),
      prop: 'tag',
      enumType: 'homestayTag',
      placeholder: t('homestay.selectTag'),
      required: false,
    },
    {
      label: t('homestay.homestayDescribe'),
      prop: 'describe',
      placeholder: t('homestay.enterHomestayDescribe'),
      required: false,
    },
    {
      label: t('homestay.picturesAndVideos'),
      prop: 'thumb',
      required: false,
    },
  ])
  const form = ref({
    homestayName: '',
    area: '',
    detailAddress: '',
    rentType: '',
    antecedentMoney: '',
    rent: '',
    tag: [],
    describe: '',
    thumb: '',
  })
  const rules: Rules = {
    homestayName: {
      required: true,
      message: t('order.enterHomestayName'),
    },
    area: {
      required: true,
      message: t('homestay.selectLocalArea'),
    },
    rentType: {
      required: true,
      message: t('homestay.selectRentType'),
    },
    rent: {
      required: true,
      message: t('homestay.enterRent'),
    },
  }

  const { execute, errorFields, resetFields } = useValidator(form, rules)

  const handleOpen = (row: any) => {
    operateType.value = row ? 'edit' : 'add'
    if (row) {
      Object.keys(form.value).forEach((key) => {
        if (key === 'tag') {
          form.value[key] = row[key].map((o) => o.value)
        } else {
          form.value[key] = row[key]
        }
      })
    }
    getAreaList()
    visible.value = true
  }

  const getAreaList = async () => {
    setAreaLoading(true)
    const {
      response: {
        value: { data },
      },
    } = await getAdministrativeDivisions()
    areaList.value = data
    setAreaLoading(false)
  }

  const changArea = ({ value }) => {
    const index = value.code.length % 2 === 0 ? value.code.length / 2 - 1 : 4
    selectAreaArr.value[index] = value.name
    if (index === 4) {
      selectArea.value = selectAreaArr.value.join(' ')
    }
  }

  const handleSelectFile = ({ files }) => {
    file.value = files[0]
  }

  const handleRemoveFile = () => {
    file.value = null
  }

  const handleClose = () => {
    visible.value = false
    Object.keys(form.value).forEach((key) => {
      form.value[key] = ''
    })
    file.value = null
    resetFields()
  }

  const handleSubmit = async () => {
    form.value.address = `${form.value.area} ${form.value.detailAddress}`
    form.value.thumb = file.value
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

<style lang="scss" scoped>
  .money-input {
    width: calc(100% - 1.75rem) !important;
  }
  .unit {
    width: 1.25rem;
    text-align: center;
    display: inline-block;
  }
</style>
