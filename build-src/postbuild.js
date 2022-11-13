const fs = require('fs')

fs.writeFileSync('build/start.bat', 'node .\npause', { flag: 'w+' })
fs.writeFileSync('build/start.sh', 'node .', { flag: 'w+' })

let pkg = require('../package.json')

pkg.scripts = {}
pkg.main = 'index.js'

fs.writeFileSync('build/package.json', JSON.stringify(pkg), { flag: 'w+' })

console.log('Build complete' + '\n')