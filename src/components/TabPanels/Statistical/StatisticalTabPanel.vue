<template>
  <q-tab-panel name="statistical">
    <div class="row fit justify-between items-center">
      <div class="col-md-6">
        <div class="row fit justify-start">
          <h6 style="margin: 1em 1em 1em 1em">Distribusi Semantik</h6>
        </div>
      </div>
      <div class="col-md-6 small-fit">
        <div class="row fit justify-end q-gutter-xs small-justify-center">
          <q-btn-toggle unelevated no-caps style="border: 1px solid silver !important"
            v-model="percentOccurenceToggle"
            @input="handlePercentOccurenceToggle"
            toggle-color="primary"
            color="white"
            text-color="primary"
            :options="[
              {label: '# okurensi', value: 'occurence'},
              {label: '% persentase', value: 'percentage'}
            ]"
          />
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
    <ExpansionItemForSanskrit
      ref="collapsible"

      v-for="word in Object.keys(sanskritWords)"
      :key="word"
      :word="word"
      :wordChipData="{'sanskritWords': sanskritWords}"

      @input="handleExpansionItemForSanskritToggle"
    />
  </q-tab-panel>
</template>

<script>
import { defineComponent } from 'vue'

import ExpansionItemForSanskrit from 'components/TabPanels/Statistical/ExpansionItemForSanskrit'

export default defineComponent({
  components: {
    ExpansionItemForSanskrit
  },

  methods: {
    handleExpansionItemForSanskritToggle: function (targetValue) {
      // target value sends the value of clicked collapsible
      this.changeCollapseExpandAllIcon()
    },
    handlePercentOccurenceToggle: function (value) {
      let collapsible
      for (collapsible in this.$refs.collapsible) {
        const currColl = this.$refs.collapsible[collapsible]
        let wordChip

        for (wordChip in currColl.$refs.wordchip) {
          currColl.$refs.wordchip[wordChip].toggleToShow(value)
        }
      }
    }
  }
})
</script>

<style>

</style>
