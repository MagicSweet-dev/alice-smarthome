import {checkAuthorization, route} from "../../../../app";
import {findDevice} from "../../../../device";
import util from "util";

route('POST', async (req, res) => {
	let requestId = req.header('X-Request-Id')
	
	let response: any[] = []
	for (let it of req.body.payload.devices) {
		let json = {} as any
		
		json.id = it.id
		let device = findDevice(it.id)
		let customData = it.custom_data
		if (device) {
			let results: (string | boolean)[] = []
			for (let cap of it.capabilities) {
				results.push(await device.action(cap.type, cap.state.instance, cap.state.value, customData))
			}
			if (results.find(it => typeof it === 'string') && results.find(it => typeof it === 'boolean' && !it)) {
				json.action_result = {
					status: 'ERROR',
					error_message: results.find(it => typeof it === 'string')
				}
			} else {
				json.action_result = {
					status: 'DONE'
				}
			}
		} else {
			json.action_result = {
				status: 'ERROR',
				error_code: 'DEVICE_NOT_FOUND',
				error_message: 'Устройство не найдено'
			}
		}
		

		response.push(json)
	}
	return {
		request_id: requestId,
		payload: {
			devices: response
		}
	}
}, checkAuthorization)