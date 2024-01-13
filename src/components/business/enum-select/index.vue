<template>
  <Dropdown
    class="w-12rem"
    :options="options"
    :optionLabel="optionLabel"
    :optionValue="optionValue"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { getEnum } from '@/utils/enums'

  const props = defineProps({
    enumType: {
      type: String,
      required: true,
    },
    optionLabel: {
      type: String,
      default: 'label',
    },
    optionValue: {
      type: String,
      default: 'value',
    },
    showAll: {
      type: Boolean,
      default: false,
    },
    filterValue: {
      type: [Array | undefined],
      default: undefined,
    },
    placeholder: {
      type: String,
    },
  })

  const options = computed(() => getEnum(props.enumType, props.showAll, props.filterValue))
</script>

<style scoped></style>
