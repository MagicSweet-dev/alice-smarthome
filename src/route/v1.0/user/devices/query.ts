import {checkAuthorization, route} from "../../../../app";
import {Device, findDevice} from "../../../../device";

route('POST', async (req, res) => {
	let requestId = req.header('X-Request-Id')

	let response: any[] = []
	for (let it of req.body.devices) {
		let json = {} as any

		json.id = it.id
		
		let device = findDevice(it.id)
		let customData = it.custom_data
		if (device) {
			json = {...device.config}

			if (device.config.capabilities) json.capabilities = []
			for (let cap of device.config.capabilities) {
				let result = await device.query(cap.type, customData)
				if (typeof result === 'string') {
					// TODO error if capability not found (returned string is error message)
				} else {
					json.capabilities.push({ type: cap.type, state: result})
				}
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