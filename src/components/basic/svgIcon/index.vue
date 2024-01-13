<template>
  <svg :class="svgClass" :style="style" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconClass" />
  </svg>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps({
    iconName: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
      default: 'svg-icon',
    },
    style: {
      type: Object,
    },
  })
  const iconClass = computed(() => `#icon-${props.iconName}`)
  const svgClass = computed(() => {
    if (props.className) {
      return `svg-icon ${props.className}`
    }
    return props.className
  })
</script>

<style lang="less" scoped>
  .svg-icon {
    width: 1.25rem;
    height: 1.25rem;
    vertical-align: middle;
  }
</style>
