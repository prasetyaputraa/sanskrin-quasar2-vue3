import colorOps from '../@local-utilities/color-ops'
import * as tf from '@tensorflow/tfjs'

import { boot } from 'quasar/wrappers'

tf.setBackend('webgl')

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default boot( async ( { app, router, store } ) => {

  const pixels = await colorOps.loadColors2('/images/100pxs-percentage-color-bar.png').then(function (pixels) {
    return pixels
  })

  const pxlDataTn = tf.tensor(pixels.data, [pixels.shape[0], pixels.shape[2]])

  const alphaOpsTn = tf.tensor1d([1, 1, 1, 1 / 2.55])

  const colorRangeInRGB = tf.mul(pxlDataTn, alphaOpsTn).arraySync()

  const colorRange = colorRangeInRGB.map((rgba) => colorOps.convertFromRGBToHex(...rgba))

  app.config.globalProperties.$colorRange = colorRange
})
