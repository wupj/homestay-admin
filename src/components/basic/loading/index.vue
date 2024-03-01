<template>
  <BlockUI
    v-if="loading"
    :blocked="loading"
    class="
      loading-wrapper
      absolute
      flex flex-column
      justify-content-center
      align-items-center
      w-full
      h-full
      z-1
    "
  >
    <ProgressSpinner style="width: 24px; height: 24px" v-bind="$attrs" />
    <div class="text-white mt-2">{{ loadText }}</div>
  </BlockUI>
</template>

<script lang="ts" setup>
  import i18n from '@/locale'

  defineProps({
    loading: {
      type: Boolean,
      required: true,
    },
    loadText: {
      type: String,
      default: i18n.global.t('common.pleaseWait'),
    },
  })
</script>

<style lang="scss" scoped>
  .loading-wrapper {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
