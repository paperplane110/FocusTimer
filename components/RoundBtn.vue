<template>
  <button class="flex justify-center items-center w-32px h-32px border rounded-1 transition-all transform hover:border-gray-400"
    :class="[props.isActivated ? 'bg-dark-200 text-light-200' : '']"
  >
    <slot></slot>
  </button>
</template>

<script setup lang='ts'>

type Props = {
  isActivated?: boolean | undefined
}
const props = defineProps<Props>()

</script>

<style scoped>

</style>
