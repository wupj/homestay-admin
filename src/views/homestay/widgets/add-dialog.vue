<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'add' ? '新增民宿' : '编辑民宿'"
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
              chooseLabel="点击上传"
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
                  <p class="mt-4 mb-0">拖放文件到这里进行上传</p>
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
            <span class="unit ml-2" v-if="['antecedentMoney', 'rent'].includes(item.prop)">元</span>
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
      <Button class="mr-4" icon="pi pi-times" label="取消" @click="handleClose" text raised />
      <Button icon="pi pi-check" label="确定" @click="handleSubmit" />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
  import { ref, defineExpose } from 'vue'
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator'
  import type { Rules } from 'async-validator'
  import { useToast } from 'primevue/usetoast'
  import { getAdministrativeDivisions } from '@/api'

  const emit = defineEmits(['done'])

  const toast = useToast()

  const visible = ref(false)
  const operateType = ref('')
  const areaLoading = ref(false)
  const areaList = ref([])
  const selectArea = ref('')
  const selectAreaArr = ref([])
  const file = ref(null)
  const formArr = ref([
    {
      label: '民宿名称',
      prop: 'homestayName',
      placeholder: '请输入民宿名称',
      required: true,
    },
    {
      label: '地方区域',
      prop: 'area',
      placeholder: '请选择地方区域',
      required: true,
    },
    {
      label: '详细地址',
      prop: 'detailAddress',
      placeholder: '请输入详细地址',
      required: false,
    },
    {
      label: '租房类型',
      prop: 'rentType',
      enumType: 'rentType',
      placeholder: '请选择租房类型',
      required: true,
    },
    {
      label: '押金',
      prop: 'antecedentMoney',
      placeholder: '请输入押金',
      required: false,
    },
    {
      label: '租金',
      prop: 'rent',
      placeholder: '请输入租金',
      required: true,
    },
    {
      label: '标签',
      prop: 'tag',
      enumType: 'homestayTag',
      placeholder: '请选择标签',
      required: false,
    },
    {
      label: '民宿描述',
      prop: 'describe',
      placeholder: '请输入民宿描述',
      required: false,
    },
    {
      label: '图片/视频',
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
      message: '请输入民宿名称',
    },
    area: {
      required: true,
      message: '请选择地方区域',
    },
    rentType: {
      required: true,
      message: '请选择租房类型',
    },
    rent: {
      required: true,
      message: '请输入租金',
    },
  }

  const { execute, errorInfo, errorFields } = useAsyncValidator(form, rules, { immediate: false })

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
    areaLoading.value = true
    const {
      response: {
        value: { data },
      },
    } = await getAdministrativeDivisions()
    areaList.value = data
    areaLoading.value = false
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
    errorInfo.value = null
    Object.keys(form.value).forEach((key) => {
      form.value[key] = ''
    })
    file.value = null
  }

  const handleSubmit = async () => {
    form.value.address = `${form.value.area} ${form.value.detailAddress}`
    form.value.thumb = file.value
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
