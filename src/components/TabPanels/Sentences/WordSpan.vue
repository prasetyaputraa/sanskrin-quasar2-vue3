<template>
  <span>
    <span
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
      @click="$emit('word-click', {index: index, word: word, row: row})"
      :class="{ hovered: isHover, clicked: (activeIndex === index), bytrans: isHighlightedByTransalation }"
    >{{ word }}</span>
    <span>{{ ' ' }}</span>
  </span>
</template>

<script>
import { defineComponent, onUpdated } from 'vue'

export default defineComponent({
  name: 'WordSpan',

  props: {
    word: String,
    index: Number,
    activeIndex: Number
  },

  data: function () {
    return {
      row: 0,
      isHover: false,
      clicked: false,
      isHighlightedByTransalation: false
    }
  }
})
</script>

<style lang="scss">
  .hovered {
    background-color: yellow;
  }

  .bytrans {
    background-color: indianred;
  }

  .clicked {
    background-color: yellow;
  }
</style>
