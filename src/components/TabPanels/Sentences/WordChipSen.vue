<template>
  <q-chip size="md" class="q-chip-with-right-avatar" :class="{ selected: selected }">
    <q-avatar
      v-ripple
      color="green" text-color="white" :icon="selected ? 'check_box' : 'keyboard_arrow_right'" class="right-avatar cursor-pointer"
      @click="$emit('click', { coordinate: coordinate, translation: translation })"
    >
    </q-avatar>
    {{ translation }}
  </q-chip>
</template>

<script>
import { defineComponent, onUpdated, computed } from 'vue'

export default defineComponent({
  name: 'WordChipSen',

  props: {
    translation: String,
    sanskritIndex: Number,
    index: Number,
    selectedCoordinate: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },

  data: function () {
    return {
      otherGroups: [],
    }
  },

  setup: function (props) {
    const coordinate = [props.sanskritIndex, props.index]

    const selected = computed(() => {
      if (props.selectedCoordinate[0] === coordinate[0] &&
          props.selectedCoordinate[1] === coordinate[1]) {
        return true
      }

      return false
    })

    return {
      selected,
      coordinate
    }
  }
})
</script>

<style lang="scss" scoped>
  .selected {
    background-color: #4caf50 !important;
    color: white;
  }

</style>
