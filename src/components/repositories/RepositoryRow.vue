<script setup lang="ts">
import { computed, defineProps } from 'vue'
import StarIcon from '@components/icons/StarIcon.vue'
import GlobeIcon from '@components/icons/GlobeIcon.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  stars: {
    type: Number,
    required: true,
  },
})

const ownerProfileLink = computed(() => `https://github.com/${props.owner}`)
const repositoryPageLink = computed(() => `${ownerProfileLink.value}/${props.name}`)
</script>
<template>
  <div
    class="
      flex flex-col
      gap-y-1
      rounded-lg
      border-2 border-purple-600
      py-2
      px-4
    "
  >
    <div>
      <a
        class="text-purple-600 font-semibold"
        title="Профиль автора"
        target="_blank"
        :href="ownerProfileLink"
      >{{ owner }}</a>
      /
      <a
        class="text-purple-600 font-semibold"
        title="Страница репозитория"
        target="_blank"
        :href="repositoryPageLink"
      >{{ name }}</a>
    </div>
    <div v-if="description">
      {{ description }}
    </div>
    <div v-if="language" class="flex items-center">
      <GlobeIcon class="w-6 h-6 fill-current text-purple-600 mr-2" />{{
        language
      }}
    </div>
    <div class="flex items-center">
      <StarIcon class="w-6 h-6 fill-current text-purple-600 mr-2" />{{ stars }}
    </div>
  </div>
</template>
