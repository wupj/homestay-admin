<template>
  <MultiSelect
    v-if="multiple"
    :class="className"
    :options="options"
    :optionLabel="optionLabel"
    :optionValue="optionValue"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
  <Dropdown
    v-else
    :class="className"
    :options="options"
    :optionLabel="optionLabel"
    :optionValue="optionValue"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
</template>

<script lang="tsx" setup>
  import { computed } from 'vue'
  import { getEnum } from '@/utils/enums'

  const props = defineProps({
    className: {
      type: String,
      default: 'w-12rem',
    },
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
    multiple: {
      type: Boolean,
      default: false,
    },
  })

  const options = computed(() => getEnum(props.enumType, props.showAll, props.filterValue))
</script>

<style scoped></style>
