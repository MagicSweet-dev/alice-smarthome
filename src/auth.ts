import {app} from "./index";
import * as JSON5 from "json5"
import fs from "fs";

export let authConfig = require('./config/authentication.json5')
authConfig.save = function() {
    fs.writeFileSync('./config/authentication.json5', JSON5.stringify(authConfig, null , '\t'))
}

app.get('/auth/', async (req, res) => {
    if (authConfig.token) {
        res.status(403)
        res.send('Token already generated')
        return
    }
    let url = `${req.query.redirect_uri}?` + new URLSearchParams({
        state: req.query.state as any,
        redirect_uri: req.query.redirect_uri as any,
        code: 'gay',
        client_id: req.query.client_id as any
    })
    res.redirect(url)
})

app.post('/token/', async (req, res) => {
    if (authConfig.token) {
        res.status(403)
        res.send('Token already generated')
        return
    }
    let token = makeid(32)
    res.send(JSON.stringify({
        access_token: token
    }))
    authConfig.token = token
    authConfig.save()
})

function makeid(length = 32) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
