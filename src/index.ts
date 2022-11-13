import express from "express"
import * as bodyParser from "body-parser";
import * as fs from "fs";

require('json5/lib/register')

export let app = express()

export let config = require('./config/config.json5')

app.use(require('cors')())
app.use(bodyParser.json())
app.use(express.urlencoded({
    extended: true
}))

let checkFolder = function(dir) {
    for (let route of fs.readdirSync(dir)) {
        let path = `${dir}${route}`
        if (fs.lstatSync(path).isDirectory()) checkFolder(`${path}/`)
        if (!route.endsWith('.js')) continue
        require('./app').preparedRoute = path.replace('./route', '').replace('.js', '')
        require(`${path}`)
    }
}

checkFolder('./route/')

require('./auth')

app.listen(config.port, config.host, () => {
    console.log(`Rest API interface ready! Listening ${config.host}:${config.port}`)
})