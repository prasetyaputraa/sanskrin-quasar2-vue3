<template>
  <q-chip class="q-chip-with-right-avatar" square :value="true">

    <q-avatar class="right-avatar" v-bind:style="avatarBackgroundStyle"
    text-color="black">
      {{ (toShow === 'percentage') ? percentage + '%' : readable(occurence) }}
    </q-avatar>
    <q-tooltip content-class="silver word-tooltip">{{ (toShow === 'percentage') ? percentage + '%' : occurence }}</q-tooltip>
    {{ word }}
  </q-chip>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WordChip',
  props: {
    word: String,
    color: String,
    percentage: Number,
    occurence: Number
  },

  data: function () {
    let percentageToColorIndex = this.percentage

    if (percentageToColorIndex === 0) percentageToColorIndex = 1

    return {
      toShow: 'percentage',
      avatarBackgroundStyle: {
        'background-color': '#' + this.$colorRange[percentageToColorIndex - 1] + ' !important'
      }
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
  .word-tooltip {
    font-size: 2em;
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
