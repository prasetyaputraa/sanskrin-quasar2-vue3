<template>
  <q-tab-panel :name="name">
    <div class="row fit justify-between items-center">
      <div class="col-md-6">
        <div class="row fit justify-start">
          <h6 style="margin: 1em 1em 1em 1em">{{ title }}</h6>
        </div>
      </div>
      <div class="col-md-6 small-fit">
        <div class="row fit justify-end q-gutter-xs small-justify-center">
          <q-btn unelevated style="border: 1px solid silver !important"
            :ripple="false"
            size="md"
            color="white"
            text-color="primary"
            :icon="collapseIcon"
            class="right-button-in-distribution"

            @click="handleCollapseOrExpandAll"
          >
            <q-tooltip content-class="silver">Collapse/Expand All</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
    <ExpansionItemForSanskritDict
      v-for="(word, i) in Object.keys(sanskritWords)"

      :ref="el => { if (el) collapsibles[i] = el }"
      :key="word"
      :word="word"
      :wordChipData="{'sanskritWords': sanskritWords}"

      @input="handleExpansionItemForSanskritToggle"
    />
  </q-tab-panel>
</template>

<script>
import { defineComponent, ref, onBeforeUpdate } from 'vue'

import ExpansionItemForSanskritDict from 'components/TabPanels/Dictionary/ExpansionItemForSanskritDict'

export default defineComponent({
  name: 'DictionaryTabPanel',

  components: {
    ExpansionItemForSanskritDict
  },

  props: {
    name: String,
    title: String,
    sanskritWords: Object
  },

  setup : function (props) {
    const collapsibles = ref([])
    const collapseIcon = ref('expand_less')

    onBeforeUpdate(() => { collapsibles.value = [] })

    return {
      collapsibles,
      collapseIcon
    }
  },

  methods: {
    isAllCollapsed: function () {
      for (let collapsible in this.collapsibles) {
        if (this.collapsibles[collapsible].expanded) return false
      }

      return true
    },

    handleCollapseOrExpandAll: function () {
      const action = (this.collapseIcon === 'expand_less') ? 'hide' : 'show'

      for (let collapsible in this.collapsibles) {
        if (action === 'show') {
          this.collapsibles[collapsible].expanded = true
        }

        if (action === 'hide') {
          this.collapsibles[collapsible].expanded = false
        }
      }

      this.changeCollapseExpandAllIcon()
    },

    handleExpansionItemForSanskritToggle: function (targetValue) {
      // target value sends the value of clicked collapsible
      this.changeCollapseExpandAllIcon()
    },

    changeCollapseExpandAllIcon: function () {
      if (this.isAllCollapsed()) {
        this.collapseIcon = 'expand_more'
      } else {
        this.collapseIcon = 'expand_less'
      }
    }
  },

  data: () => {
    return {
    }
  }

})
</script>

<style>

</style>
