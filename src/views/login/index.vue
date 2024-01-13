<template>
  <div class="container flex justify-content-center align-items-center surface-100">
    <Card>
      <template #content>
        <div class="logo-box flex flex-row align-items-center justify-content-between">
          <div class="image"></div>
          <div class="form-box flex-1 ml-4">
            <div class="title text-center text-4xl">欢迎登录</div>
            <TabView class="mt-4" :active-index="activeIndex">
              <TabPanel header="账号登录">
                <form class="flex flex-column gap-4">
                  <div class="w-full">
                    <div class="p-input-icon-left w-full">
                      <i class="pi pi-user" />
                      <InputText
                        class="w-full"
                        v-model="username"
                        v-bind="usernameProps"
                        placeholder="请输入账号"
                      />
                    </div>
                    <small class="block p-error mt-2 text-base" v-if="errors.username">{{
                      errors.username
                    }}</small>
                  </div>
                  <div class="w-full">
                    <div class="p-input-icon-left w-full">
                      <i class="pi pi-lock" />
                      <InputText
                        class="w-full"
                        type="password"
                        v-model="password"
                        v-bind="passwordProps"
                        placeholder="请输入密码"
                      />
                    </div>
                    <small class="block p-error mt-2 text-base" v-if="errors.password">{{
                      errors.password
                    }}</small>
                  </div>
                  <div class="w-full">
                    <div class="flex align-items-center w-full">
                      <InputText
                        class="w-full"
                        v-model="captcha"
                        v-bind="captchaProps"
                        placeholder="请输入验证码"
                      />
                      <Captcha
                        class="ml-2"
                        :code="captchaValue"
                        :height="33.8"
                        @refresh="queryCaptcha"
                      />
                    </div>
                    <small class="block p-error mt-2 text-base" v-if="errors.captcha">{{
                      errors.captcha
                    }}</small>
                  </div>
                  <div class="flex align-items-center">
                    <Checkbox v-model="notLogin" inputId="not-login" :binary="true" />
                    <label class="ml-2 cursor-pointer" for="not-login">1个月内免登录</label>
                  </div>
                  <Button label="登录" :loading="submitLoading" @click="clickSubmit" />
                </form>
              </TabPanel>
              <TabPanel header="扫码登录">
                <div class="flex flex-column justify-content-center align-items-center w-full">
                  <img class="w-6 h-6" :src="qrcode" alt="QR Code" />
                  <div class="text-400">请使用共享民宿APP扫码登录</div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { useForm } from 'vee-validate'
  import Captcha from '@/components/basic/captcha'

  import { useQRCode } from '@vueuse/integrations/useQRCode'
  import { useUserStore } from '@/store'
  import { getCaptcha, login } from '@/api'
  import {setCookie} from "@/utils/cookie";

  const router = useRouter()
  const qrcode = useQRCode('text-to-encode')
  const userStore = useUserStore()

  const activeIndex = ref(0)
  const submitLoading = ref(false)
  const captchaValue = ref('')
  const notLogin = ref(false)

  const { defineField, errors, handleSubmit, handleReset } = useForm({
    validationSchema: {
      username: (value) => {
        if (!value) {
          return '请输入账号'
        }
        return true
      },
      password: (value) => {
        if (!value) {
          return '请输入密码'
        }
        return true
      },
      captcha: (value) => {
        if (!value) {
          return '请输入验证码'
        }
        if (value.toLocaleUpperCase() !== captchaValue.value.toLocaleUpperCase()) {
          return '验证码错误'
        }
        return true
      },
    },
  })

  const [username, usernameProps] = defineField('username')
  const [password, passwordProps] = defineField('password')
  const [captcha, captchaProps] = defineField('captcha')

  const queryCaptcha = async () => {
    const { data } = await getCaptcha()
    captchaValue.value = data.value
  }

  const clickSubmit = handleSubmit(async () => {
    const {
      response: {
        value: { data, code, message },
      },
    } = await login({
      name: username.value,
      password: password.value,
      notLogin: notLogin.value,
    })
    if (code === 200) {
      userStore.setUserInfo(data)
      await router.push('/home')
    } else {
      handleReset()
    }
  })

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
