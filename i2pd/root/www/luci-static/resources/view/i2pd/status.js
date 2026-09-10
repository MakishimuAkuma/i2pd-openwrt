'use strict';
'require view';
'require rpc';
'require ui';

const callService = rpc.declare({
	object: 'luci.i2pd',
	method: 'status'
});

function runAction(method) {
	return rpc.declare({
		object: 'luci.i2pd',
		method: method,
		params: {}
	})().then(function(res) {
		if (res && res.ok) {
			L.ui.addNotification(
				null,
				E('p', _('Action executed successfully.')),
								 'info'
			);

			window.location.reload();
		}

		throw new Error(_('Failed to execute service action.'));
	}).catch(function(err) {
		L.ui.addNotification(
			null,
			E('p', {}, err.message || _('Failed to execute service action.')),
							 'error'
		);
	});
}

return view.extend({
	load: function() {
		return callService();
	},

	render: function(status) {
		let is_running = status?.running === true;
		let is_enabled = status?.enabled === true;

		let state = is_running
		? E('span', {
			'style': 'color:green; font-weight:bold'
		}, _('RUNNING'))
		: E('span', {
			'style': 'color:red; font-weight:bold'
		}, _('STOPPED'));

		if (is_running && status.pid) {
			state.appendChild(
				E('span', {
					'style': 'margin-left:10px; font-weight:normal'
				}, _('PID: ') + status.pid)
			);
		}

		let m = E('div', {
			'class': 'cbi-map'
		}, [
			E('h2', {}, _('i2pd Status')),

				  E('div', {
					  'class': 'cbi-map-descr'
				  }, _('Monitor and control your local i2pd Private Network Router.')),

				  E('table', {
					  'class': 'table'
				  }, [
					  E('tr', {
						  'class': 'tr'
					  }, [
						  E('td', {
							  'class': 'td left',
		  'style': 'width:30%'
						  }, _('Service State')),

						E('td', {
							'class': 'td left'
						}, state)
					  ]),

		E('tr', {
			'class': 'tr'
		}, [
			E('td', {
				'class': 'td left'
			}, _('Autostart')),

		  E('td', {
			  'class': 'td left'
		  }, is_enabled
		  ? _('Enabled')
		  : _('Disabled'))
		]),

		E('tr', {
			'class': 'tr'
		}, [
			E('td', {
				'class': 'td left'
			}, _('Runtime config')),

		  E('td', {
			  'class': 'td left'
		  }, status?.config || '/var/lib/i2pd.conf')
		])
				  ]),

			E('hr'),

				  E('div', {
					  'class': 'cbi-page-actions'
				  }, [
					  is_enabled
					  ? E('button', {
						  'class': 'btn cbi-button-reset',
						  'click': () => runAction('disable')
					  }, _('Disable'))
					  : E('button', {
						  'class': 'btn cbi-button-save',
						  'click': () => runAction('enable')
					  }, _('Enable')),

					is_running
					? E('button', {
						'class': 'btn cbi-button-reset',
		 'style': 'margin-left:5px',
		 'click': () => runAction('stop')
					}, _('Stop'))
					: E('button', {
						'class': 'btn cbi-button-save',
		 'style': 'margin-left:5px',
		 'click': () => runAction('start')
					}, _('Start')),

					E('button', {
						'class': 'btn cbi-button-apply',
	   'style': 'margin-left:5px',
	   'click': () => runAction('restart')
					}, _('Restart'))
				  ])
		]);

		return m;
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
