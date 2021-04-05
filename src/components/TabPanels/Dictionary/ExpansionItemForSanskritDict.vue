<template>
  <q-expansion-item
    @input="handleToggle"
    v-model="expanded"
    expand-separator
    icon="code"
    :label="word"
    :disable="disable"
  >
    <template v-slot:header>
      <q-item-section class="col-xs-1 small-none">
        <q-icon name="code" size="sm" class="text-grey icon-section"/>
      </q-item-section>
      <q-item-section style="margin-left: -8px; font-size: 1.25em" v-bind:class="{ 'word-section': true, 'text-red': disable }">
        {{ displayWord }}
      </q-item-section>
      <!-- <q-item-section v-if="!disable" class="flex justify-end pos-section">
        <q-chip square size="md" color="grey" outline>{{wordChipData.sanskritWords[word].posTag}}</q-chip>
      </q-item-section> -->
    </template>
    <q-card class="sanskrit-words-dropdown">
      <template v-if="isTranslationAvailable(wordChipData.sanskritWords[word])">
        <!-- <WordChip ref="wordchip" v-for="meaning in filterSemantics(wordChipData.sanskritWords[word].meaning)"
          :key="meaning[0]" :word='meaning[0]' :percentage='meaning[1]' :occurence='meaning[2]'
        /> -->
        <q-expansion-item
          dense-toggle
          default-opened
          class="expansion-level-2"
          :key="index" v-for="index in Object.keys(translations.sanskrit)"
          :label="translations.sanskrit[index]"
          expand-separator
        >
          <template v-slot:header>
            <q-item-section style="margin-left: -8px;">
              {{ translations.sanskrit[index] }}
            </q-item-section>
            <q-item-section class="flex justify-end pos-section">
              <q-chip v-if="translations['part of speech'][index]" square size="md" color="grey" outline>{{ translations['part of speech'][index] }}</q-chip>
            </q-item-section>
          </template>
          <WordChipDict
            v-for="translation in explodeTranslations(translations.translations[index], ';')"
            :key="translation"
            :index="index"
            :translation="translation"
          />
        </q-expansion-item>
      </template>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { defineComponent } from 'vue'

import WordChipDict from 'components/TabPanels/Dictionary/WordChipDict'

export default defineComponent({
  name: 'ExpansionItemForSanskritDict',

  components: {
    WordChipDict
  },

  data: () => {
    return {
      expanded: true,
      disable: false,
      displayWord: ''
    }
  },

  created () {
    this.displayWord = this.word

    if ((typeof this.wordChipData.sanskritWords[this.word]) !== 'string') {
      this.displayWord += ' (tidak ditemukan pada kamus)'
      this.expanded = false
      this.disable = true
    } else {
      this.translations = JSON.parse(this.wordChipData.sanskritWords[this.word])
      // console.log(this.translations)
    }
  },

  methods: {
    handleToggle: function (nextState) {
      this.expanded = nextState

      this.$emit('input', nextState)
    },

    isTranslationAvailable: function (val) {
      if ((typeof val) === 'string') {
        return true
      }

      return false
    },

    filterSemantics: function (arr) {
      try {
        return arr.filter(function (val, index, arr) {
          for (let i = 0; i < index; i++) {
            if (arr[i][0] === val[0]) {
              if (arr[i][1] === val[1]) {
                throw new Error('Duplicate entries of semantic found')
              }

              return false
            }
          }
          return true
        })
          .sort((a, b) => a[1] - b[1])
      } catch (e) {
        return [[`Calculation Error: ${e.message}`, 0, 0]]
      }
    },

    explodeTranslations: function (translationsString, delimiter) {
      if (translationsString === null) {
        return []
      }

      const translations = translationsString.split(delimiter)

      return translations
    }
  },

  props: {
    word: String,
    value: Boolean,
    wordChipData: Object
  }
})
</script>

<style lang="scss">
  .expansion-level-2  {
    .q-expansion-item__content {
      padding-bottom: 20px;
    }
  }
</style>

<style lang="scss" scoped>
  @media only screen and (max-width: 720px) {
      .small-none {
          display: none;
      }

      .word-section {
        margin-left: 0 !important;
      }

      .sanskrit-words-dropdown {
        padding-left: 2em !important;
      }
  }

  .sanskrit-words-dropdown {
    padding-top: 1em;
    padding-bottom: 1em;

    padding-left: 64px;
  }

  .pos-section {
    flex-direction: row;
    justify-content: flex-end !important;
  }
</style>
