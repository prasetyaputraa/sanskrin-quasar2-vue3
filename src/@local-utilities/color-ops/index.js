import getPixels from 'get-pixels'
import util from 'util'
import rgbToHex from 'rgb-hex'

const getPixelsPromise = util.promisify(getPixels)

export default {

  getColorFromPercentage: function (percentage) {
    const Y = 0.8 // brightness value20

    const degree = parseInt(percentage * 360)

    const U = Math.cos(degree)
    const V = Math.sin(degree)

    const B = 1.164 * (Y - 16) + 2.018 * (U - 128)

    const G = 1.164 * (Y - 16) - 0.813 * (V - 128) - 0.391 * (U - 128)

    const R = 1.164 * (Y - 16) + 1.596 * (V - 128)

    return [R, G, B, 1]
  },

  loadColors2: function (filePath) {
    return getPixelsPromise(filePath, function (err, pixels) {
      if (err) {
        console.log('bad image path')
      }
    })
  },

  convertFromRGBToHex: function (red, green, blue, alpha) {
    if (typeof alpha === 'undefined') {
      alpha = 1
    }

    // ensure the alpha value range from 0 to 1
    // on range of the base of 10
    // ex: convert 0-100, 0-1000 into decimal ranging 0-1
    // ----------------------------------------------
    // caution: break on range that is not base of 10
    // ex: range of 0-255 will be treated as a range of 0-1000
    // and so will be converted at maximum of 0.255
    if (alpha > 1) {
      alpha = alpha / (Math.pow(10, (Math.ceil(Math.log(alpha) / Math.log(10)))))
    }

    return rgbToHex(red, green, blue, alpha)
  }
}
