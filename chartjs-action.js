const { createCanvas } = require('canvas')
const { Chart  } = require('chart.js/auto')
const yaml = require('yaml')
const path = require('path')
const fs = require('fs')

function createChart(chartData, options) {
    const canvasWidth = options.width * 1
    const canvasHeight = canvasWidth / 16 * 9

    let canvas
    if (options.format.match(/svg/i))
        canvas = createCanvas(canvasWidth, canvasHeight, 'svg')
    else
        canvas = createCanvas(canvasWidth, canvasHeight)

    new Chart(canvas.getContext('2d'), chartData)

    if (options.format.match(/svg/i))
        return canvas.toBuffer()
    else
        return canvas.toBuffer('image/png')
}

module.exports = function (content, options) {
    let chartData = yaml.parse(content)

    //  overrider and deactivate all animations
    chartData.options.animation = false
    chartData.options.animations = { colors: false, x: false }
    chartData.options.transitions = { active: { animation: { duration: 0 } } }

    return createChart(chartData, options)
}
