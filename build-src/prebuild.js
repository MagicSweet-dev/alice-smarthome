const fs = require('fs')

fs.mkdir('build/', () => {
    console.log('Build environment prepared')
})