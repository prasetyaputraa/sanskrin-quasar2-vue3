/*
export function someMutation (state) {
}
*/

export const buildTranslation = (state, payload) => {
  state.builtTranslations = payload
}

export const placeTranslation = (state, payload) => {
  state.builtTranslations.set(payload.index, payload.data)
}

export const placeTranslationAtIndex = (state, { index, payload }) => {
  console.log('index and payload', index, payload)

  let array = [...state.builtTranslations.entries()]

  array.splice(index, 0, [payload.index, payload.data])

  state.builtTranslations = new Map(array)
}

export const resetTranslation = (steat, payload) => {
  state.builtTranslations = new Map()
}

export const reorderByDraggable = (state, newArray) => {
  state.builtTranslations = new Map(newArray)
}

export const reorderTranslations = (state, { from, to }) => {
  state.builtTranslations = new Map(
    [...state.builtTranslations.entries()].splice(to, 0, [...state.builtTranslations.entries()].splice(from, 1)[0])
  )
}
