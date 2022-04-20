<script setup lang="ts">
import type { PropType } from 'vue'
import { defineProps } from 'vue'
import LoadingSpinner from '@components/UI/LoadingSpinner.vue'
import type { RepositoryInfo } from '@api/fetchRepos'
import RepositoryRow from './RepositoryRow.vue'

defineProps({
  repositories: {
    type: Array as PropType<Array<RepositoryInfo>>,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>

<template>
  <div class="flex flex-col gap-y-2 pb-2">
    <RepositoryRow
      v-for="repository of repositories"
      :key="repository.id"
      v-bind="repository"
      class=""
    />
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
