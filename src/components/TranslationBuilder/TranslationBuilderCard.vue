<template>
  <q-card flat bordered class="col-5 rounded-borders q-pa-lg text-white bg-primary trans-build-card">
    <q-card-section style="min-height: 150px">
      <draggable v-model="translations" group="translation" item-key="[0]" @start="itemBeingDragged = true" @end="itemBeingDragged = false" ghost-class="ghost" drag-class="move-drag">
        <template #item="{element}">
          <WordSpan
            :index="element[0]" :__data="element[1]" :translation="element[1].translation" :activeIndex="activeIndex" :builderState="builderState"
            :ref="el => { if (el) wordSpans.push(el) }"
          />
        </template>
        <template #footer v-if="translations.length">
          <q-btn flat icon="add" size="xs" @click="addTranslation"/>
        </template>
      </draggable>
    </q-card-section>
    <q-card-section style="padding: 0px" class="trash-section">
      <draggable v-model="trash" item-key="[0]" :group="trashOptions" ghost-class="trash-ghost" drag-class="move-drag">
        <template #item="{element}">
          <span class="trash" :index="element[0]" :__data="element[1]" :translation="element[1].translation" :activeIndex="activeIndex" :builderState="builderState"/>
        </template>
        <template #footer>
          <div 
            class="row fit justify-center text-white" :class="{ indianred: itemBeingDragged }" style="margin: 0px; padding: 10px"
            @mouseleave="trashHovered = false"
          >
            <q-icon size="xs" :name="(itemBeingDragged) ? 'delete_forever' : 'delete'"/><span v-if="itemBeingDragged">Seret untuk menghapus</span>
          </div>
        </template>
      </draggable>
    </q-card-section>

    <q-separator dark/>
    <q-card-actions>
      <div class="col-6">
        <div class="row justify-start fit q-gutter-sm">
          <!-- <q-btn unelevated :disable="builderState === 'move'" icon="open_with" @click="builderState = 'move'"/>
          <q-btn unelevated :disable="builderState === 'edit'" icon="edit" @click="builderState = 'edit'"/> -->
        </div>
      </div>
      <div class="col-6">
        <div class="row justify-end fit q-gutter-sm" style="padding-top: 10px !important">
          <q-btn 
          unelevated square no-caps 
          icon-right="cloud_upload" color="green" label="Ajukan"
          :loading="submissionLoading"
          :percentage="submissionLoadPercentage"
          @click="$emit('submit-click')"/>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent, ref, reactive, onBeforeUpdate, onUpdated, computed } from 'vue'
import { useStore } from 'vuex'

import WordSpan from 'components/TranslationBuilder/WordSpan'
import draggable from 'vuedraggable'

export default defineComponent({
  name: 'TranslationBuilderCard',

  components: {
    WordSpan,
    draggable,
  },

  props: {
    submissionLoading: {
      type: Boolean,
      required: true,
      default: () => false
    },
    submissionLoadPercentage: {
      type: Number,
      required: true,
      default: () => 0
    },
    activeIndex: {
      type: Number,
      required: true,
      default: () => null
    }
  },

  setup: function (props) {
    const $store = useStore()

    const builderState = ref(null)
    const itemBeingDragged = ref(false)
    const trashHovered = ref(false)

    const wordSpans = ref([])

    const trashOptions = {
      name: 'trash',
      put: () => true,
      pull: false
    }

    const translations = computed({
      get: () => {
        return [...$store.state.translationBuilder.builtTranslations.entries()]
      },

      set: (newArray) => {
        $store.commit('translationBuilder/reorderByDraggable', newArray)
      }
    })

    const addTranslation = () => {
      const chosenWS = wordSpans.value[wordSpans.value.length - 1]

      chosenWS.additionalSpace.textContent = ''
      chosenWS.spaceEditable = true
      chosenWS.$nextTick(() => {
        chosenWS.additionalSpace.focus()
        chosenWS.additionalSpace.select()
      })

      console.log(chosenWS.additionalSpace)
    }

    onBeforeUpdate(() => {
      wordSpans.value = []
    })

    onUpdated(() => {
      // console.log(wordSpans.value)
    })

    return {
      translations,
      builderState,
      itemBeingDragged,
      trashOptions,
      trashHovered,
      wordSpans,
      addTranslation
    }
  }
})
</script>

<style lang="scss">
  .ghost {
    color: black;
    background-color: darkcyan;
  }

  .trash-ghost {
    display: none;
  }

  .trash-section {
    div {
      .ghost {
        display: none !important;
      }
    }
  }

  .move-drag {
    background-color: indianred !important;
  }

  .trans-build-card {
    padding-bottom: 10px !important;
  }

  .trash {
    display: none
  }

  .indianred {
    background-color: indianred !important;
  }
</style>
