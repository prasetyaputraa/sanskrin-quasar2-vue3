<template>
  <q-tab-panel :name="name">
    <div style="font-size: 2em;">
      <!-- props down, events up. -->
      <template v-for="i in sentences.split(' ').length" :key="i">
        <WordSpan 
          :ref="(el) => { if (el) wordInPars[i - 1] = el }"
          :word="sentences.split(' ')[i - 1]" 
          :activeIndex="activeIndex"
          :index="i - 1"
          @word-click="$emit('word-click', $event)" 
        />
        <TranslationDiv
          :index="i - 1"
          :ref="(el) => { if (el) translationDivs[i - 1] = el }"
          :canBeActive="false"
          :active="false"
          :activeIndex="activeIndex"
          :activeRow="activeRow"
          :translations="activeTranslations"
        />
      </template>
    </div>
  </q-tab-panel>
</template>

<script>
import { createApp, defineComponent, ref, 
  reactive, onBeforeUpdate, onMounted, onUpdated,
  computed, getCurrentInstance } from 'vue'

import WordSpan from 'components/TabPanels/Sentences/WordSpan'
import TranslationDiv from 'components/TabPanels/Sentences/TranslationDiv'

export default defineComponent({
  name: 'SentencesTabPanel',

  components: {
    WordSpan,
    TranslationDiv
  },

  props: {
    name: String,
    sentences: String,
    activeIndex: {
      type: Number,
      required: true,
      default: () => {
        return null
      }
    },
    activeRow: {
      type: Number,
      required: true,
      default: () => {
        return null
      }
    },
    activeWord: {
      type: String,
      required: true,
      default: () => {
        return null
      }
    },
    translations: {
      type: Object,
      required: true,
      default: () => {
        return null
      }
    }
  },

  setup: function (props) {
    let wordInPars = reactive([])
    let translationDivs = reactive([])
    let lastInLineWordInPars = reactive([])

    const activeTranslations = computed(() => {
      let activeTranslations

      try {
        activeTranslations = JSON.parse(props.translations[props.activeWord.trim()])
      } catch (err) {
        activeTranslations = null
      }

      return activeTranslations
    })

    onBeforeUpdate(() => {
      wordInPars = []
      translationDivs = []
      lastInLineWordInPars = []
    })

    onMounted(() => {
      const firstWordInPar = wordInPars[0]
      let currentRow = 1

      firstWordInPar.row = currentRow
      const firstRowTopRectY = firstWordInPar.$el.getBoundingClientRect().top

      let currentRowTopRectY = firstRowTopRectY

      for (let i in wordInPars) {
        if ((wordInPars[i].$el.getBoundingClientRect().top) === currentRowTopRectY) {
          wordInPars[i].row = currentRow
          translationDivs[i].row = currentRow
        } else if ((wordInPars[i].$el.getBoundingClientRect().top) >= currentRowTopRectY) {
          currentRow += 1
          currentRowTopRectY = wordInPars[i].$el.getBoundingClientRect().top

          wordInPars[i].row = currentRow
          translationDivs.row = currentRow

          lastInLineWordInPars.push(wordInPars[i - 1])
          translationDivs[i - 1].canBeActive = true
        }

        if (parseInt(i) === (wordInPars.length - 1)) {
          if (wordInPars[i] !== lastInLineWordInPars[lastInLineWordInPars.length - 1]) {
            lastInLineWordInPars.push(wordInPars[i])
            translationDivs[i].canBeActive = true
          }
        }
      }
    })

    return {
      wordInPars,
      translationDivs,
      lastInLineWordInPars,
      activeTranslations
    }
  },
})
</script>

<style>

</style>
