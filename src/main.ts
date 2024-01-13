import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import ToastService from 'primevue/toastservice'
import router from '@/router'
import store from '@/store'

import '@/utils/request'
import 'virtual:svg-icons-register'

import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import 'primevue/resources/themes/lara-light-purple/theme.css'

import App from './App.vue'

const app = createApp(App)

app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)

app.use(PrimeVue)
app.use(ToastService)
app.use(router)
app.use(store)
app.mount('#app')
