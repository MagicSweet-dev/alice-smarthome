import {on, query} from "../../device";
import {exec} from "node:child_process";
import {execSync} from "child_process";

const ping = require('ping');
const wol = require('wol')

let config = require('./config.json5')

on('devices.capabilities.on_off', async (instance, value) => {
    if (instance != 'on') return 'Неверный синтаксис: instance может быть только on'
    if (value) {
        wol.wake(config.mac, function(err, res) {
            if (err) {
                console.error(err)
            }
            console.log('Computer turned on')
            console.log(res);
        })
    } else {
        exec(`sudo -u magicsweet sshpass -p ${config.ssh.password} ssh ${config.ssh.username}@${config.ip} shutdown /s /f /t 0`)
        console.log('Computer turned off')
    }
})

query('devices.capabilities.on_off', async () => {
    let result = await ping.promise.probe(config.ip, {timeout: 0.2})
    return {
        instance: 'on',
        value: result.alive
    }
})