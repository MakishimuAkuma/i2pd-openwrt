'use strict';

import { cursor } from 'uci';

const uci_cursor = cursor();
const ubus_conn = require('ubus').connect();

function service_status() {
	let result = ubus_conn.call('service', 'list', {
		name: 'i2pd'
	});

	let running = false;
	let pid = null;
	let instance = null;

	if (result && result.i2pd && result.i2pd.instances) {
		for (let name, item in result.i2pd.instances) {
			if (item && item.running === true) {
				running = true;
				pid = item.pid || null;
				instance = name;
				break;
			}
		}
	}

	return {
		running: running,
		pid: pid,
		instance: instance
	};
}

function service_enabled() {
	return system([
		'/etc/init.d/i2pd',
		'enabled'
	]) == 0;
}

function service_action(action) {
	return {
		ok: system([
			'/etc/init.d/i2pd',
			action
		], 30000) == 0
	};
}

return {
	'luci.i2pd': {
		status: {
			call: function() {
				let state = service_status();

				uci_cursor.load('i2pd');

				let data_dir =
					uci_cursor.get('i2pd', 'main', 'data_dir')
					|| '/var/lib/i2pd';

				return {
					running: state.running,
					pid: state.pid,
					instance: state.instance,
					enabled: service_enabled(),
					data_dir: data_dir,
					config: '/var/lib/i2pd.conf',
					tunnels_dir: '/etc/i2pd/tunnels.d'
				};
			}
		},

		start: {
			call: function(request) {
				return service_action('start');
			}
		},

		stop: {
			call: function(request) {
				return service_action('stop');
			}
		},

		restart: {
			call: function(request) {
				return service_action('restart');
			}
		},

		enable: {
			call: function(request) {
				return service_action('enable');
			}
		},

		disable: {
			call: function(request) {
				return service_action('disable');
			}
		}
	}
}
