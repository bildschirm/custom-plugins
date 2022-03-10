const superagent = require('superagent');

module.exports = function lights({ sync, dashboard }) {
	const urlFactory = (ip, code, state) => `http://${ip}:4001/433mhz/${code}/${state}`;

	//const state = process.argv[3];
	const groups = ['A', 'B', 'C'];

	const service = sync
		.createService('lights', {
			on: false
		});

	service.action('toggle')
		.requirePermission('update', 'lifecycle', 'any')
		.handler(async (data, { state }) => {
			state.on = !state.on;

			for (const group of groups) {
				for (let i = 1; i <= 3; i++) {
					const url = urlFactory('localhost', `${group}${i}`, state.on ? 'on' : 'off');
					await superagent.get(url);
					//await sleep(750);
				}
			}
		});

	dashboard.component('lights').custom(__dirname + '/widget.html');

	return {
		version: '0.0.1',
		description: 'Lights'
	};
}
