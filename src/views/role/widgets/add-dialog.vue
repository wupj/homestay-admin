<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'add' ? '新增角色' : '编辑角色'"
    :style="{ width: '40rem' }"
    :draggable="false"
    @hide="handleClose"
    modal
  >
    <div class="flex justify-content-start align-items-center">
      <form class="w-full">
        <div
          class="form-field w-full flex justify-content-start"
          :class="{ 'align-items-center': item.prop !== 'describe' }"
          v-for="(item, index) in formArr"
          :key="index"
        >
          <div class="w-5rem text-right font-semibold mr-2"
            ><label :class="{ 'is-required': item.required }">{{ item.label }}</label></div
          >
          <div class="flex-1 relative">
            <Textarea
              v-if="item.prop === 'describe'"
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
      <Button class="mr-4" icon="pi pi-times" label="取消" @click="handleClose" text raised />
      <Button icon="pi pi-check" label="确定" @click="handleSubmit" />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
  import { ref, defineExpose } from 'vue'
  import { useToast } from 'primevue/usetoast'
  import { Rules } from 'async-validator'
  import useValidator from '@/hooks/useValidator'

  const emit = defineEmits(['done'])

  const toast = useToast()

  const visible = ref(false)
  const operateType = ref('')
  const formArr = ref([
    {
      label: '角色编号',
      prop: 'roleNo',
      placeholder: '请输入角色编号',
      required: true,
    },
    {
      label: '角色名称',
      prop: 'roleName',
      placeholder: '请输入角色名称',
      required: true,
    },
    {
      label: '角色描述',
      prop: 'describe',
      placeholder: '请输入角色描述',
      required: false,
    },
  ])
  const form = ref({
    roleNo: '',
    roleName: '',
    describe: '',
  })
  const rules: Rules = {
    roleNo: {
      required: true,
      message: '请输入角色编号',
    },
    roleName: {
      required: true,
      message: '请输入角色名称',
    },
  }

  const { execute, errorFields, resetFields } = useValidator(form, rules)

  const handleOpen = (row: any) => {
    operateType.value = row ? 'edit' : 'add'
    if (row) {
      Object.keys(form.value).forEach((key) => {
        form.value[key] = row[key]
      })
    }
    visible.value = true
  }

  const handleClose = () => {
    visible.value = false
    Object.keys(form.value).forEach((key) => {
      form.value[key] = ''
    })
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

<style lang="scss" scoped></style>
