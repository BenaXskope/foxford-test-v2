<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import { debounce } from '@utils/functions'

const props = defineProps({
  placeholder: {
    type: [String, Number],
    required: false,
    default: '',
  },
  btnText: {
    type: String,
    required: false,
    default: 'Search',
  },
  formDisabled: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emits = defineEmits({
  search(searchValue: string) {
    return searchValue !== null && searchValue.toString().length > 0
  },
})

const searchString = ref<string | null>(null)

const handleInput = debounce(() => {
  if (searchString.value !== null && searchString.value.length > 0)
    emits('search', searchString.value)
}, 500)
</script>

<template>
  <div>
    <input
      v-model="searchString"
      type="text"
      :placeholder="placeholder.toString()"
      required
      class="
        appearance-none
        w-full
        rounded-lg
        py-2
        px-4
        border-2 border-purple-600
        focus:outline-none focus:bg-white focus:border-2
        dark:bg-gray-900
      "
      @input="handleInput"
    >
  </div>
</template>
