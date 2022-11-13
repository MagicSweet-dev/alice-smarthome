import fs from "fs";

export class Device {
	public config
	public path
	runners: { str: string, func: (instance, value, customData?) => Promise<string | undefined> }[] = []
	queries: { str: string, func: (customData?) => Promise<{instance: string, value} | string> }[] = []

	async action(capability: string, instance: string, value, customData): Promise<string | boolean> {
		let runner = this.findRunner(capability)
		if (!runner) return 'Устройство не поддерживает это умение'
		return await runner.func(instance, value, customData) ?? true
	}

	async query(capability: string, customData): Promise<{instance: string, value} | string> {
		let query = this.findQuery(capability)
		if (!query) return 'Устройство не поддерживает это умение'
		return await query.func()
	}

	private findRunner(capability: string) {
		return this.runners.find(it => it.str == capability)
	}

	private findQuery(capability: string) {
		return this.queries.find(it => it.str == capability)
	}

}

export let devices: Device[] = []
let device: Device

export function on(str: string, func: (instance, value, customData?) => string | undefined | any) {
	device.runners.push({str, func})
}

export function query(str: string, func: () => Promise<{instance: string, value} | string | undefined | any>) {
	device.queries.push({str, func})
}

let dir = './devices'

for (let route of fs.readdirSync(dir)) {
	let path = `${dir}/${route}`
	if (fs.lstatSync(path).isDirectory()) {
		let config = require(`${path}/device.config.json5`)

		let it = new Device()
		device = it

		it.config = config
		it.path = path

		require(`${path}/index`)

		devices.push(it)
	}
	device = undefined as any
}




export function findDevice(id: string): Device | undefined {
	return devices.filter(it => it.config.id == id)[0]
}
