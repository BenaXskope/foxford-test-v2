<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import SearchBar from '@components/UI/SearchBar.vue'
import RepositoriesList from '@components/repositories/RepositoriesList.vue'
import IntersectionObserver from '@components/utility/IntersectionObserver.vue'
import MyToggle from '@components/UI/MyToggle.vue'
import { DEFAULT_PAGE_SIZE, ServerUnavailableError, findRepos } from '@api/fetchRepos'
import type { RepositoryInfo } from '@api/fetchRepos'
import { exhaustiveCheck } from './utils/typing'

const isDarkTheme = ref(localStorage.getItem('dark') !== null)
watchEffect(() => {
  if (isDarkTheme.value) {
    document.querySelector('html')!.classList.add('dark')
    localStorage.setItem('dark', '1')
  }
  else {
    document.querySelector('html')!.classList.remove('dark')
    localStorage.removeItem('mode')
  }
})

const isLoading = ref(false)
const loadedPages = ref(0)
const loadedRepos = computed(() => loadedPages.value * DEFAULT_PAGE_SIZE)
const totalCount = ref(0)
const searchString = ref<string | null>(null)
const repositories = ref<Array<RepositoryInfo>>([])

const loadRepos = async() => {
  if ((loadedRepos.value >= totalCount.value && totalCount.value !== 0)
      || !searchString.value)
    return

  isLoading.value = true
  const findResult = await findRepos({
    searchString: searchString.value,
    page: loadedPages.value + 1,
  })

  if (findResult.isRight()) {
    const findResultData = findResult.value
    totalCount.value = findResultData.totalCount
    repositories.value = findResultData.repos
    loadedPages.value += 1
  }
  else {
    const error = findResult.value
    if (ServerUnavailableError.guard(error))
      // eslint-disable-next-line no-console
      console.log(`Handled error: ${error}`) // Обработка ошибок
    else
      exhaustiveCheck(error) // Проверяем, что обработали все
  }

  isLoading.value = false
}
watch(searchString, () => {
  loadedPages.value = 0
  repositories.value = []
  totalCount.value = 0
  loadRepos()
})
</script>

<template>
  <div
    class="
      flex flex-col
      h-screen
      items-center
      overflow-y-auto
      pt-10
      px-4
      dark:bg-gray-900 dark:text-white
    "
  >
    <div class="p-2 max-w-screen-xl flex flex-col w-full">
      <div class="flex gap-x-2 items-center self-center mb-2">
        Light
        <MyToggle v-model="isDarkTheme" />
        Dark
      </div>
      <h1 class="text-3xl font-semibold text-center mb-10">
        GitHub repositories searcher
      </h1>
      <SearchBar
        class="mb-6"
        placeholder="Find repo"
        @search="(newSearchString) => (searchString = newSearchString)"
      />
      <div
        v-if="searchString && repositories.length === 0 && !isLoading"
        class="self-center font-bold text-2xl text-gray-500"
      >
        No repos found :(
      </div>
      <div
        v-else-if="!isLoading"
        class="self-center font-bold text-xl text-purple-600 mb-4"
      >
        Repos found: {{ totalCount }}
      </div>
      <RepositoriesList :is-loading="isLoading" :repositories="repositories" />
      <IntersectionObserver :key="repositories.length" @intersect="loadRepos" />
    </div>
  </div>
</template>
