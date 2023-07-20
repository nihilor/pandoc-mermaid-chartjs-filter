const { createCanvas, loadImage } = require('canvas')
const { Chart  } = require('chart.js/auto')
const yaml = require('yaml')
const path = require('path')
const fs = require('fs')

function createChart(chartData) {
    const canvas = createCanvas(800, 400)
    const ctx = canvas.getContext('2d')
  
    new Chart(ctx, chartData)
    const dataBuffer = canvas.toBuffer('image/png')
    return dataBuffer
}

module.exports = function (content, options) {
    let chartData = yaml.parse(content)

    //  overrider and deactivate all animations
    chartData.options.animation = false
    chartData.options.animations = { colors: false, x: false }
    chartData.options.transitions = { active: { animation: { duration: 0 } } }

    return createChart(chartData)
}
