import {app} from "./index";
import * as util from "util";
import {authConfig} from "./auth";

export type method = 'GET' | 'POST' | 'HEAD'

export let preparedRoute: string

export function route(method: method, match: (req, res) => ({ code: number, message: string} | any), ...checks) {
	let route = preparedRoute
	console.log(`Preparing route: ${route} / ${method}`)
	let func = async (req, res) => {
		console.log(`${new Date().toDateString()} / ${new Date().toTimeString()} | ${method} ${route} \n${util.format(req.body)}`)
		
		try {
			
			for (let checkFunc of checks) {
				let check = await checkFunc(req, res)
				if (!check) {
					res.status(403)
					res.send('Check Failed')
					return
				}
				if (typeof check === 'object' && !check.code.toString().startsWith('2')) {
					res.status(check.code)
					res.send(check.message)
					return
				}
			}
			
			let result = await match(req, res)
			
			let code = 200
			let message = 'OK'
			
			if (result) {
				if (typeof result == 'number') code = result
				if (typeof result == 'string') message = result
				if (typeof result == 'object') {
					if (!result.code && !result.message) {
						message = JSON.stringify(result)
					} else {
						if (result.code) code = result.code
						if (result.message) message = result.message
					}
				}
			} else {
				code = 404
				message = 'Not Found'
			}
			
			res.status(code)
			res.send(message)
		} catch (e) {
			console.error(e)
			res.status(400)
			res.send(e)
		}
	}
	switch (method) {
		case "GET": return app.get(route, func)
		case "POST": return app.post(route, func)
		case "HEAD": return app.head(route, func)
	}
}

export function checkAuthorization(req, res): boolean | { code: number, message: string} {
	let header: string = req.header('Authorization')
	if (!header) return false
	
	try {
		return header.split(' ')[1] == authConfig.token
	} catch (e) {
		return { code: 500, message: e as string }
	}
	
}
