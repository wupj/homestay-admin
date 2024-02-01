import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { usePrimeVue } from 'primevue/config'

const useTheme = (initValue: string = 'light') => {
  const PrimeVue = usePrimeVue()
  const theme = useLocalStorage('theme', initValue)

  const initTheme = (value: string) => {
    document
      .getElementById('theme-link')
      ?.setAttribute('href', `/themes/lara-${value}-purple/theme.css`)
  }

  const changeTheme = (value: string) => {
    PrimeVue.changeTheme(`lara-${theme.value}-purple`, `lara-${value}-purple`, 'theme-link', () => {
      theme.value = value
    })
  }

  return { theme, initTheme, changeTheme }
}

export default useTheme
