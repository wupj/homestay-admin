import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import router from '@/router'
import store from '@/store'
import i18n from '@/locale'

import '@/utils/request'
import 'virtual:svg-icons-register'

import 'normalize.css/normalize.css'
import 'primeicons/primeicons.css'
import '@/styles/index.scss'

import App from './App.vue'

const app = createApp(App)

app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)

app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)
app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app')
