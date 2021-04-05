<template>
  <q-chip class="q-chip-with-right-avatar" square :value="true">

    <q-avatar v-if="hasAdditionalPOSTag" class="right-avatar"
    text-color="black">
      {{ additionalPOSTag }}
    </q-avatar>
    <q-tooltip v-if="showIndex" content-class="silver word-tooltip-index">{{ 'Anda dapat menemukan entri ini pada materi sumber: di indeks no. ' + index }}</q-tooltip>
    {{ processedTranslation }}
  </q-chip>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WordChip',

  props: {
    index: String,
    translation: String,
    color: String,
    percentage: Number,
    occurence: Number
  },

  data: function () {
    let percentageToColorIndex = this.percentage

    if (percentageToColorIndex === 0) percentageToColorIndex = 1

    return {
      toShow: 'percentage',
      processedTranslation: '',
      showIndex: true,
      hasAdditionalPOSTag: false,
      additionalPOSTag: ''
    }
  },

  created: function () {
    if (this.translation) {
      this.processedTranslation = this.translation.trim()

      this.processedTranslation = this.processedTranslation.replace(/^[.]+/, '')
        .replace(/[.]+$/, '').replace(/[.]+$/, '')
        .toLowerCase()
    }
  },

  methods: {
    // fallback method when getting percentage colors from image bar doesn't work
    getColor: function (percentage) {
      return this.$percentageColors[Math.floor((percentage / 10))]
    },

    toggleToShow: function (typeToShow) {
      this.toShow = typeToShow
    },

    readable: function (occ) {
      if (occ >= 1000) {
        return (occ / 1000).toFixed(2) + 'k'
      }

      return occ
    }
  }
})
</script>

<style lang="scss" scoped>
  .q-avatar {
    width: 1.5em;
  }
</style>

<style lang="scss">
  .word-tooltip-index {
    font-size: 1em;
  }

  .q-chip-with-right-avatar {
    .q-chip__content {
      direction: rtl;
    }

  }

  .right-avatar {
    margin-right: -.45em !important;
    margin-left: .2em !important;
    border-radius: 0 3px 3px 0!important;
  }
</style>
