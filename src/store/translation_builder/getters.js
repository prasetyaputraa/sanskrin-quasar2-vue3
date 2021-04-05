/*
export function someGetter (state) {
}
*/
export const builtTranslationsLowestIndex = (state) => {
  const array = [...state.builtTranslations.entries()].sort((a, b) => {
      return a[0] - b[0]
    })

  return array[0][0]
}

export const getSelectedCoordinateForIndex = (state) => (index) => {
  return state.builtTranslations.get(index)
}

export const getIndexOfAKey = (state) => (key) => {
  return [...state.builtTranslations.keys()].indexOf(key)
}
