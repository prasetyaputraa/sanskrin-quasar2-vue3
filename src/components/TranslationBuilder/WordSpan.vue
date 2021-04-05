<template>
  <span @click="handleClick">
    <span :contenteditable="mainEditable"
      class="input" role="textbox" style="font-size: 1.25em"
      @mouseover="highlightWordSpan"
      @mouseleave="isHighlighted = false"
      @mousedown="isHighlighted = false"
      @keydown.enter.prevent="changeToManualTranslation"
      :class="{ highlighted : isHighlighted && !mainEditable, active : (activeIndex === index)}"
      ref="mainSpace"
    >{{ translation ? translation : '' }}</span>
    <span v-if="spaceEditable">{{ ' ' }}</span>
    <span :contenteditable="spaceEditable"
      @mouseover="mouseOnBlank = true" @mouseleave="mouseOnBlank = false"
      @keydown.enter.prevent="submitManualTranslation"
      style="font-size: 1.25em"
      ref="additionalSpace"
      class="show-up-space"
    >{{ ' ' }}<q-tooltip>Double click to add manual translation</q-tooltip></span>
    <span v-if="spaceEditable">{{ ' ' }}</span>
  </span>
</template>

<script>
import { defineComponent, ref, reactive, onUpdated, nextTick } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'WordSpan',

  props: {
    index: {
      type: Number,
      required: true,
      default: () => null
    },
    activeIndex: {
      type: Number,
      required: true,
      default: () => null
    },
    __data: {},
    translation: String
  },

  setup: function (props) {
    const $store = useStore()

    let clicks = ref(0)
    let clickTimer = reactive(null)
    let mouseOnBlank = ref(false)
    let spaceEditable = ref(false)
    let mainEditable = ref(false)

    const mainSpace = ref(null)
    const additionalSpace = ref(null)

    const handleClick = (evt) => {
      clicks.value++

      if (clicks.value === 1) {
        clickTimer = setTimeout(() => {
          clicks.value = 0
        }, 500)
      } else {
        clearTimeout(clickTimer)
        clicks.value = 0

        if (mouseOnBlank.value) {
          spaceEditable.value = true
          nextTick(() => {
            let range = document.createRange()
            let selection = window.getSelection()

            range.selectNodeContents(additionalSpace.value)
            selection.removeAllRanges()
            selection.addRange(range)

            additionalSpace.value.focus()
          })
        } else {
          mainEditable.value = true
          nextTick(() => {
            let range = document.createRange()
            let selection = window.getSelection()

            range.selectNodeContents(mainSpace.value)
            selection.removeAllRanges()
            selection.addRange(range)

            mainSpace.value.focus()
          })
        }
      }
    }

    const submitManualTranslation = () => {
      spaceEditable.value = false
      mainEditable.value = false

      additionalSpace.value.blur()

      const lowestIndexAtStore = $store.getters['translationBuilder/builtTranslationsLowestIndex']

      const lowestIndex = (lowestIndexAtStore <= 0) ? (lowestIndexAtStore - 1) : (-1)

      const currentIndex = $store.getters['translationBuilder/getIndexOfAKey'](props.index)

      $store.commit(
        'translationBuilder/placeTranslationAtIndex',
        {index: currentIndex + 1, payload: { index: lowestIndex, data: {coordinate: [-1, -1], translation: additionalSpace.value.textContent.trim()}}}
      )

      additionalSpace.value.textContent = ' '
    }

    const changeToManualTranslation = () => {
      mainEditable.value = false
      spaceEditable.value = false
      nextTick(() => {
        mainSpace.value.blur()
      })

      if (mainSpace.value.textContent.trim() === props.translation.trim()) {
        return true
      }

      $store.commit(
        'translationBuilder/placeTranslation',
        {index: props.index, data: { coordinate: [-1, -1], translation: mainSpace.value.textContent.trim() }}
      )
    }

    return {
      handleClick,
      clicks,
      clickTimer,
      mouseOnBlank,
      spaceEditable,
      mainEditable,

      mainSpace,
      additionalSpace,

      submitManualTranslation,
      changeToManualTranslation
    }
  },

  methods: {
    highlightWordSpan: function () {
      this.isHighlighted = true
    },

    unHighlight: function () {
      this.isHighlighted = false
    },
  },

  data: function () {
    return {
      isHighlighted: false,
      mouseIsDown: false,
    }
  }
})
</script>

<style lang="scss" scoped>
  .active {
    text-decoration: underline;
    text-decoration-color: yellow;
    text-decoration-thickness: .2em;
  }

  .highlighted {
    background-color: yellow;
    color: black;
  }

  [contenteditable] {
    outline: 0px solid transparent;
  }
</style>
