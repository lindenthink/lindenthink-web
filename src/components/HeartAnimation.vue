<template>
  <label class="animate-on-click">
    <input type="checkbox" :checked="modelValue" @change="handleChange">
    <div class="heartbox">
      <div role="img" alt="interactive heart animation" class="element"></div>
    </div>
  </label>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (event) => {
  const newValue = event.target.checked
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<style lang="less" scoped>
.animate-on-click {
  cursor: pointer;

  .heartbox {
    display: grid;
    place-content: center;
    width: 60px;
    height: 60px;

    .element {
      background-image: url('/heart.png');
      width: 100px;
      height: 100px;
      background-size: 2900px 100px;
    }
  }

  &>input {
    display: none;
  }

  &>input:checked~.heartbox .element {
    animation: heartAnimation 1s steps(29, jump-none) forwards;
  }
}

@keyframes heartAnimation {
  from {
    background-position: 0px 0px;
  }

  to {
    background-position: -2800px 0px;
  }
}
</style>