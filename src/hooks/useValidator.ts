import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator'

const useValidator = (value?: any, rules?: any, options?: any) => {
  const { errorInfo, ...data } = useAsyncValidator(value, rules, {
    immediate: false,
    manual: true,
    ...options,
  })

  const resetFields = () => {
    errorInfo.value = null
  }

  return {
    errorInfo,
    resetFields,
    ...data,
  }
}

export default useValidator
