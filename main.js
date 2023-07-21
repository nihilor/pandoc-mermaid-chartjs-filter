#! /usr/bin/env node
const pandoc    = require('pandoc-filter')
const fs        = require('fs')
const path      = require('path')
const process   = require('process')
const yaml      = require('yaml')

const mermaidAction = require('./mermaid-action.js')
const chartjsAction = require('./chartjs-action.js')

/*
utils
*/

function createLogger() {
    //  it's necessary to redirect any standard output into a file
    //  otherwise pandoc will break
    const loggerFilename    = path.join(process.cwd(), 'pandoc-mermaid-chartjs-filter.log')
    const loggerStream      = fs.createWriteStream(loggerFilename)
    const { log }           = console

    console.log = function (message) {
        loggerStream.write(message + '\n')
        log.apply(console, arguments)
    }

    process.stderr.write = loggerStream.write.bind(loggerStream)
    return console
}

function createDataURI(data, format) {
    const formats = {
        'svg': 'image/svg+xml',
        'png': 'image/png'
    }

    if (!formats.hasOwnProperty(format)) return null

    let encodedData = new Buffer.from(data).toString('base64')
    return `data:${formats[format]};base64,${encodedData}`
}

function createDataFile(data, format, options) {
    fs.writeFileSync(options.filename, data)
    return fs.existsSync(options.filename)
}

function loadOptions(userOptions = []) {
    const options = {
        background: 'white',
        caption: '',
        filename: false,
        format: 'png',
        inline: false,
        scale: 2,
        skip: false,
        theme: 'default',
        width: '800'
    }

    userOptions.forEach(option => {
        if (option.length == 2 && options.hasOwnProperty(option[0].toLowerCase()))
            options[option[0].toLowerCase()] = option[1]
    })

    options.format = options.format.toLowerCase().trim()

    return options
}

/*
main
*/

function action({ t: type, c: value }, format, meta) {
    if (type != 'CodeBlock') return null

    let data = null
    let options = loadOptions(value[0][2])

    const classes   = value[0][1]
    const content   = value[1]
    const id        = value[0][0]
    const title     = options.caption
    const alt       = options.caption

    if (!options.filename)
        options.filename = `figure-${figureIndex}.${options.format}`
    else
        if (options.filename.match(/\.(svg|png)$/i))
            options.format = options.filename.match(/\.(svg|png)$/i)[1]

    if (options.skip) return null

    //  mermaid
    if (classes.includes('mermaid'))
        data = mermaidAction(content, options)

    //  chartjs
    if (classes.includes('chartjs'))
        data = chartjsAction(content, options)

    if (!data) return null

    figureIndex++

    let src = null
    if (options.inline && options.format.match(/svg|png/i))
        src = createDataURI(data, options.format)
    else {
        if (createDataFile(data, options.format, { filename: options.filename } ))
            src = options.filename
    }

    if (src)
        return pandoc.Para([
            pandoc.Image(
                [id, classes, []],
                [pandoc.Str(alt)],
                [src, title]
            )
        ])
    else
        return null
}

createLogger()
var figureIndex = 1
pandoc.stdio(action)