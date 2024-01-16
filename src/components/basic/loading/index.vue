<template>
  <div
    class="
      loading-wrapper
      absolute
      flex
      flex-column
      justify-content-center
      align-items-center
      w-full
      h-full
      surface-900
      opacity-40
      z-1
    "
    v-if="loading"
  >
    <ProgressSpinner style="width: 24px; height: 24px" v-bind="$attrs" />
    <div class="text-white mt-2">{{ loadText }}</div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    loading: {
      type: Boolean,
      required: true,
    },
    loadText: {
      type: String,
      default: '请稍后...',
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
