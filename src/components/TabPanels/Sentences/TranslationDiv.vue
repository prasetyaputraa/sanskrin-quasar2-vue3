<template>
  <div v-if="canBeActive && (activeRow === row)">
    <q-card flat class="bg-grey-3 text-white base-card">
      <div v-if="translations">
        <q-card flat bordered class="text-black bg-grey-2 content-card"
          v-for="i in Object.keys(translations.sanskrit)" :key="parseInt(i)"
          :index="parseInt(i)"
        >
          <q-card-section style="padding-top: 0px; padding-left: 0px; padding-bottom: 8px">
            <div class="text-h6">
              {{translations.sanskrit[i]}}
            </div>
          </q-card-section>
          <q-separator inset/>
            <WordChipSen v-for="translation in explodeTranslations(translations.translations[parseInt(i)], ';')"
              :selectedCoordinate="selectedCoordinate"
              :sanskritIndex="parseInt(i)"
              :translation="translation"
              :key="translation"
              :index="explodeTranslations(translations.translations[parseInt(i)], ';').indexOf(translation)"
              @click="pushToBuiltTranslations"
            />
        </q-card>
        <div class="text-black ghost-because-somehow-this-element-should-be-here-to-not-break-the-reactivity">{{ selectedCoordinate }}</div>
      </div>
      <q-card-section v-else>
        <h6 class="text-red">Terjemahan tidak ditemukan dalam kamus.</h6>
      </q-card-section>
      <q-card-section>
        <q-btn unelevated no-caps class="fit" 
          :color="(selectedCoordinate[0] < 0) ? 'green' : 'primary'" 
          :icon-right="(selectedCoordinate[0] < 0) ? 'check_box' : 'keyboard_arrow_right'"
        >
          {{ (selectedCoordinate[0] &lt; 0) ? 'Diterjemahkan secara manual' : 'Terjemahkan secara manual' }}
        </q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, computed, onUpdated, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'

import WordChipSen from 'components/TabPanels/Sentences/WordChipSen'
import { unsortedSegmentSum } from '@tensorflow/tfjs-core'

export default defineComponent({
  name: 'TranslationDiv',

  components: {
    // eslint-disable-next-line vue/no-unused-components
    WordChipSen
  },

  props: {
    index: {
      type: Number,
      required: true
    },
    activeRow: {
      type: Number,
      required: true,
      default: () => {
        return null
      }
    },
    activeIndex: {
      type: Number,
      required: true
    },
    translations: {
      type: Object,
      required: true
    }
  },

  setup: function (props) {
    const $store = useStore()

    const pushToBuiltTranslations = (eventObject) => {
      const index = props.activeIndex

      $store.commit('translationBuilder/placeTranslation', { index: index, data: eventObject })
    }

    const selectedCoordinate = computed(() => {
      const value = $store.getters['translationBuilder/getSelectedCoordinateForIndex'](props.activeIndex)

      if (value) {
        return value.coordinate
      }

      return []
    })

    const explodeTranslations = (translationsString, delimiter) => {
      if (translationsString === null) {
        return []
      }

      const translations = translationsString.split(delimiter)

      for (let i in translations) {
        translations[i] = translations[i].trim().toLowerCase()
        translations[i] = translations[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      }

      return translations
    }

    onUpdated(() => {
    })

    return {
      explodeTranslations,
      selectedCoordinate,
      pushToBuiltTranslations
    }
  },

  data: function () {
    return {
      WordChipSenGroups: {},
      wordSpanIndex: null,
      selectedCoordinatesGotFromRoot: [],
      isManualTranslated: false,
      recurse: 1,
      active: false,
      canBeActive: false,
      row: null
    }
  },
})
</script>

<style lang="scss">
  .ghost-because-somehow-this-element-should-be-here-to-not-break-the-reactivity {
    display: none;
  }

  .base-element {
    margin-top: 16px;
    width: 100%;
  }

  .base-card {
    padding: 16px;
  }

  .content-card {
    display: inline-block;
    padding: 24px;
    margin-bottom: 16px;
    margin-right: 24px;
    max-width: 50%;
  }
</style>
