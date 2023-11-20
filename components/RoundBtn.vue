<template>
  <button class="flex justify-center items-center w-32px h-32px border rounded-1 transition-all transform hover:border-gray-400
    dark:(text-gray-400 border-gray-600 hover:border-gray-400)
  " :class="[props.isActivated ? 'bg-dark-200 text-light-200 dark:(text-white border-gray-400)' : '']">
    <slot></slot>
  </button>
</template>

<script setup lang='ts'>

type Props = {
  isActivated?: boolean | undefined
}
const props = defineProps<Props>()

</script>

<style scoped></style>
