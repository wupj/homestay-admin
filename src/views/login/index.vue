<template>
  <div class="container flex justify-content-center align-items-center surface-100">
    <Card>
      <template #content>
        <div class="logo-box flex flex-row align-items-center justify-content-between">
          <div class="image"></div>
          <div class="form-box flex-1 ml-4">
            <div class="title text-center text-4xl">{{ $t('login.welcomeLogin') }}</div>
            <TabView class="mt-4" :active-index="activeIndex" @tab-change="changeTab">
              <TabPanel :header="$t('login.accountLogin')">
                <form class="flex flex-column gap-2">
                  <div class="form-field w-full flex justify-content-start align-items-center">
                    <div class="flex-1 relative">
                      <div class="p-input-icon-left w-full">
                        <i class="pi pi-user" />
                        <InputText
                          class="w-full"
                          v-model="form.name"
                          :placeholder="$t('user.enterAccount')"
                        />
                      </div>
                      <small
                        class="block p-error text-base"
                        v-if="errorFields.name && errorFields.name.length"
                        >{{ errorFields.name[0].message }}</small
                      >
                    </div>
                  </div>
                  <div class="form-field w-full flex justify-content-start align-items-center">
                    <div class="flex-1 relative">
                      <div class="p-input-icon-left w-full">
                        <i class="pi pi-lock" />
                        <InputText
                          class="w-full"
                          v-model="form.password"
                          :placeholder="$t('user.enterPassword')"
                        />
                      </div>
                      <small
                        class="block p-error text-base"
                        v-if="errorFields.password && errorFields.password.length"
                        >{{ errorFields.password[0].message }}</small
                      >
                    </div>
                  </div>
                  <div class="form-field w-full flex justify-content-start align-items-center">
                    <div class="flex align-items-center w-fullrelative">
                      <InputText
                        class="w-full"
                        v-model="form.captcha"
                        :placeholder="$t('login.enterVerificationCode')"
                      />
                      <Captcha
                        class="ml-2"
                        :code="captcha"
                        :height="33.8"
                        @refresh="queryCaptcha"
                      />
                      <small
                        class="block p-error text-base"
                        v-if="errorFields.captcha && errorFields.captcha.length"
                        >{{ errorFields.captcha[0].message }}</small
                      >
                    </div>
                  </div>
                  <div class="form-field w-full flex justify-content-start align-items-center">
                    <div class="flex align-items-center">
                      <Checkbox v-model="form.notLogin" inputId="not-login" :binary="true" />
                      <label class="ml-2 cursor-pointer" for="not-login">{{
                        $t('login.noLoginRequiredMonth')
                      }}</label>
                    </div>
                  </div>
                  <Button
                    :label="$t('login.login')"
                    :loading="submitLoading"
                    @click="handleSubmit"
                  />
                </form>
              </TabPanel>
              <TabPanel :header="$t('login.scanCodeLogin')">
                <div class="flex flex-column justify-content-center align-items-center w-full">
                  <img class="w-6 h-6" :src="qrcode" alt="QR Code" />
                  <div class="text-400">{{ $t('login.useSharedHomestayAppScanLogin') }}</div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </template>
    </Card>
    <Toast position="center" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import Toast from 'primevue/toast'
  import { useToast } from 'primevue/usetoast'
  import Captcha from '@/components/basic/captcha'

  import { useQRCode } from '@vueuse/integrations/useQRCode'
  import { Rules } from 'async-validator'
  import useValidator from '@/hooks/useValidator'
  import useLoading from '@/hooks/useLoading'
  import { useUserStore } from '@/store'
  import { getCaptcha, login } from '@/api'

  const router = useRouter()
  const { t } = useI18n()
  const toast = useToast()
  const qrcode = useQRCode('text-to-encode')
  const userStore = useUserStore()
  const [submitLoading, setSubmitLoading] = useLoading(false)

  const activeIndex = ref(0)
  const captcha = ref('')
  const form = ref({
    name: '',
    password: '',
    captcha: '',
    notLogin: false,
  })
  const rules: Rules = {
    name: {
      required: true,
      message: t('user.enterAccount'),
    },
    password: {
      required: true,
      message: t('user.enterPassword'),
    },
    captcha: {
      required: true,
      validator: (rule, value, callback) => {
        if (!value.trim()) {
          callback(new Error(t('login.enterVerificationCode')))
        }
        if (value.toLocaleUpperCase() !== captcha.value.toLocaleUpperCase()) {
          callback(new Error(t('login.verificationCodeError')))
        }
        callback()
      },
    },
  }
  let { execute, errorFields, resetFields } = useValidator(form, rules)

  const queryCaptcha = async () => {
    const { data } = await getCaptcha()
    captcha.value = data.value
  }

  const handleSubmit = async () => {
    const { pass } = await execute()
    if (pass) {
      setSubmitLoading(true)
      const {
        response: {
          value: { data, code, message },
        },
      } = await login(form.value)
      setSubmitLoading(false)
      if (code === 200) {
        userStore.setUserInfo(data)
        await router.push('/home')
      } else {
        toast.add({ severity: 'error', detail: message, life: 3000 })
        resetFields()
      }
    }
  }

  const changeTab = () => {
    form.value = {
      name: '',
      password: '',
      captcha: '',
      notLogin: false,
    }
    queryCaptcha()
    resetFields()
  }

  onBeforeMount(() => {
    queryCaptcha()
  })
</script>

<style lang="scss" scoped>
  .logo-box {
    width: 640px;
    .image {
      width: 300px;
      height: 300px;
      background: url('@/assets/image/logo-inset.png') no-repeat;
      background-size: 100% 100%;
    }
    .form-box {
      :deep(.p-tabview) {
        .p-tabview-title {
          font-size: 1.25rem;
        }
      }
    }
    .h-6 {
      height: 50%;
    }
  }
</style>
