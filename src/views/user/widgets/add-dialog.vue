<template>
  <Dialog
    v-model:visible="visible"
    :header="operateType === 'add' ? $t('user.addUser') : $t('user.editUser')"
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
                <label for="state1" class="ml-2">{{ $t('user.enable') }}</label>
              </div>
              <div class="flex align-items-center ml-5">
                <RadioButton
                  v-model="form[item.prop]"
                  inputId="state2"
                  name="state"
                  :value="false"
                />
                <label for="state2" class="ml-2">{{ $t('user.disabled') }}</label>
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
  import { getRoleList } from '@/api'
  import { Rules } from 'async-validator'
  import useValidator from '@/hooks/useValidator'
  import useLoading from '@/hooks/useLoading'

  const emit = defineEmits(['done'])

  const { t } = useI18n()
  const toast = useToast()
  const [roleLoading, setRoleLoading] = useLoading(false)

  const visible = ref(false)
  const operateType = ref('')
  const roleList = ref([])
  const formArr = ref([
    {
      label: t('user.account'),
      prop: 'accountName',
      placeholder: t('user.enterAccount'),
      required: true,
    },
    {
      label: t('user.realName'),
      prop: 'userName',
      placeholder: t('user.enterRealName'),
      required: true,
    },
    {
      label: t('user.password'),
      prop: 'password',
      placeholder: t('user.enterPassword'),
      required: true,
    },
    {
      label: t('user.confirmPassword'),
      prop: 'confirmPassword',
      placeholder: t('user.enterPasswordAgain'),
      required: true,
    },
    {
      label: t('order.phone'),
      prop: 'phone',
      placeholder: t('order.enterPhone'),
      required: true,
    },
    {
      label: t('user.email'),
      prop: 'email',
      placeholder: t('user.enterEmail'),
      required: false,
    },
    {
      label: t('user.state'),
      prop: 'state',
      required: true,
    },
    {
      label: t('user.role'),
      prop: 'roleId',
      placeholder: t('user.selectRole'),
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
  const rules: Rules = {
    accountName: {
      required: true,
      message: t('user.enterAccount'),
    },
    userName: {
      required: true,
      message: t('user.enterRealName'),
    },
    password: {
      required: true,
      message: t('user.enterPassword'),
    },
    confirmPassword: {
      required: true,
      message: t('user.enterPasswordAgain'),
    },
    phone: {
      required: true,
      message: t('order.enterPhone'),
    },
    state: {
      required: true,
      message: t('user.selectState'),
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
    getRoleData()
    visible.value = true
  }

  const getRoleData = async () => {
    setRoleLoading(true)
    const {
      response: {
        value: { data },
      },
    } = await getRoleList()
    setRoleLoading(false)
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

<style lang="scss" scoped></style>
