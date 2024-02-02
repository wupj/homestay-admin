import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const useLocale = (initValue?: string) => {
  const locale = useLocalStorage('locale', initValue)
  const { locale: i18nLocale } = useI18n()

  const changeLocale = (value: string) => {
    locale.value = value
    i18nLocale.value = value
    window.location.reload()
  }

  return { locale, changeLocale }
}

export default useLocale
