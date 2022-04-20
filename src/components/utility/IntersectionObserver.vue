<script setup lang="ts">
import { defineEmits, onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['intersect'])

const root = ref<HTMLElement | null>(null)

const observer = new IntersectionObserver(([entry]) => {
  if (entry && entry.isIntersecting)
    emit('intersect')
})

onMounted(() => {
  const el = root.value
  if (el)
    observer.observe(el)
})

onBeforeUnmount(() => {
  observer.disconnect()
})
</script>
<template>
  <div ref="root" />
</template>
