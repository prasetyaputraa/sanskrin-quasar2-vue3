<template>
  <q-expansion-item
    @input="handleToggle"
    v-model="expanded"
    expand-separator
    icon="code"
    :label="word"
  >
    <template v-slot:header>
      <q-item-section class="col-xs-1 small-none">
        <q-icon name="code" size="sm" class="text-grey icon-section"/>
      </q-item-section>
      <q-item-section style="margin-left: -8px; font-size: 1.25em" class="word-section">
        {{word}}
      </q-item-section>
      <q-item-section class="flex justify-end pos-section">
        <q-chip square size="md" color="grey" outline>{{wordChipData.sanskritWords[word].posTag}}</q-chip>
      </q-item-section>
    </template>
    <q-card class="sanskrit-words-dropdown">
      <WordChip ref="wordchip" v-for="meaning in filterSemantics(wordChipData.sanskritWords[word].meaning)"
        :key="meaning[0]" :word='meaning[0]' :percentage='meaning[1]' :occurence='meaning[2]'
      />
    </q-card>
  </q-expansion-item>
</template>

<script>
import { defineComponent } from 'vue'
import WordChip from 'components/TabPanels/Statistical/WordChip'

export default defineComponent({
  name: 'ExpansionItemForSanskrit',

  components: {
    WordChip
  },

  data: () => {
    return {
      expanded: true
    }
  },

  methods: {
    handleToggle: function (nextState) {
      this.expanded = nextState

      this.$emit('input', nextState)
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
    }
  },
  props: {
    word: String,
    value: Boolean,
    wordChipData: Object
  }
})
</script>

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
