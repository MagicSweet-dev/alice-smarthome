import {checkAuthorization, route} from "../../../app";
import {devices} from "../../../device";
import {app} from "../../../index";

route('GET', (req, res) => {
	let requestId = req.header('X-Request-Id')
	return {
		request_id: requestId,
		payload: {
			user_id: 'user',
			devices: devices.map(it => it.config)
		}
	}
}, checkAuthorization)