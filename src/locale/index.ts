import { createI18n } from 'vue-i18n'
import cn from './lang/zh-CN'
import en from './lang/en-US'

const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'zh-CN',
  legacy: false,
  allowComposition: true,
  messages: {
    'zh-CN': cn,
    'en-US': en,
  },
})

export default i18n
