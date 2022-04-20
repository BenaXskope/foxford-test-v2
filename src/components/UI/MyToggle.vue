<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    required: true,
    type: Boolean,
  },
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: Boolean): void
}>()

const toggle = () => emits('update:modelValue', !props.modelValue)

</script>

<template>
  <div
    class="
      w-14
      h-8
      flex
      items-center
      bg-gray-300
      rounded-full
      p-1
      duration-300
      cursor-pointer
    "
    aria-label="Switch theme"
    :class="{ 'bg-purple-500': modelValue }"
    @click="toggle"
  >
    <div
      class="bg-white w-6 h-6 rounded-full shadow-md transform duration-300"
      :class="{ 'translate-x-6 bg-black': modelValue }"
    />
  </div>
</template>
