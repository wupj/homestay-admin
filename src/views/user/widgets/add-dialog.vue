<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'add' ? '新增用户' : '编辑用户'"
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
            <div v-if="item.prop === 'state'" class="flex flex-wrap">
              <div class="flex align-items-center">
                <RadioButton
                  v-model="form[item.prop]"
                  inputId="state1"
                  name="state"
                  :value="true"
                />
                <label for="state1" class="ml-2">启用</label>
              </div>
              <div class="flex align-items-center ml-5">
                <RadioButton
                  v-model="form[item.prop]"
                  inputId="state2"
                  name="state"
                  :value="false"
                />
                <label for="state2" class="ml-2">禁用</label>
              </div>
            </div>
            <Dropdown
              v-else-if="item.prop === 'roleId'"
              class="w-full"
              v-model="form[item.prop]"
              :loading="roleLoading"
              :options="roleList"
              optionValue="roleNo"
              optionLabel="roleName"
              :placeholder="item.placeholder"
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
  import { getRoleList } from '@/api'

  const emit = defineEmits(['done'])

  const toast = useToast()

  const visible = ref(false)
  const operateType = ref('')
  const roleLoading = ref(false)
  const roleList = ref([])
  const formArr = ref([
    {
      label: '账号',
      prop: 'accountName',
      placeholder: '请输入账号',
      required: true,
    },
    {
      label: '真实姓名',
      prop: 'userName',
      placeholder: '请输入真实姓名',
      required: true,
    },
    {
      label: '密码',
      prop: 'password',
      placeholder: '请输入密码',
      required: true,
    },
    {
      label: '确认密码',
      prop: 'confirmPassword',
      placeholder: '请再次输入密码',
      required: true,
    },
    {
      label: '手机号码',
      prop: 'phone',
      placeholder: '请输入手机号码',
      required: true,
    },
    {
      label: '邮箱',
      prop: 'email',
      placeholder: '请输入邮箱',
      required: false,
    },
    {
      label: '状态',
      prop: 'state',
      required: true,
    },
    {
      label: '角色',
      prop: 'roleId',
      placeholder: '请选择角色',
      required: false,
    },
  ])
  const form = ref({
    accountName: '',
    userName: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    state: true,
    roleId: null,
  })

  const handleOpen = (row: any) => {
    operateType.value = row ? 'edit' : 'add'
    if (row) {
      Object.keys(form.value).forEach((key) => {
        form.value[key] = row[key]
      })
    }
    getRoleData()
    visible.value = true
  }

  const getRoleData = async () => {
    roleLoading.value = true
    const {
      response: {
        value: { data },
      },
    } = await getRoleList()
    roleLoading.value = false
    roleList.value = data
  }

  const handleClose = () => {
    visible.value = false
    Object.keys(form.value).forEach((key) => {
      if (key === 'state') {
        form.value[key] = true
      } else {
        form.value[key] = ''
      }
    })
  }

  const handleSubmit = async () => {
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
