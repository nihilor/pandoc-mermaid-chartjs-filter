const run   = require('child_process').execSync
const fs    = require('fs')
const path  = require('path')

module.exports = function (content, options) {
    let inputFile = path.join(process.cwd(), `.tmp-pmcf-input-${Date.now()}`)
    let outputFile = path.join(process.cwd(), `.tmp-pmcf-output-${Date.now()}.${options.format}`)

    fs.writeFileSync(inputFile, content)

    let resolved = path.resolve(__dirname, 'node_modules', '.bin', 'mmdc')
    let cmd = `${resolved} -i "${inputFile}" -o "${outputFile}" -e  "${options.format}" -b "${options.background}" -t "${options.theme}" -w "${options.width}" -s ${options.scale} -f`
    run(cmd)

    let fileData = options.format.match(/svg/i)
        ? fs.readFileSync(outputFile, 'utf8')
        : fs.readFileSync(outputFile)

    if (fs.existsSync(inputFile)) fs.unlink(inputFile, err => err)
    if (fs.existsSync(outputFile)) fs.unlink(outputFile, err => err)
    
    return fileData
}

