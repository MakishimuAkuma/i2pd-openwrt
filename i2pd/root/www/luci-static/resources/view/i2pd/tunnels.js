'use strict';
'require view';
'require form';
'require rpc';

const callStatus = rpc.declare({ object: 'luci.i2pd', method: 'status' });

return view.extend({
	load: function() {
		return callStatus().then(function(status) {
			return status?.tunnels_dir || '/var/lib/i2pd/tunnels.d';
		}).catch(function() {
			return '/var/lib/i2pd/tunnels.d';
		});
	},

	render: function(tunnelsDir) {
		let m = new form.Map('i2pd', _('i2pd tunnels'),
							 _('Each active tunnel configuration is processed from: %s').format(tunnelsDir));

		let s = m.section(form.TypedSection, 'tunnel', _('Tunnels'));
		s.anonymous = true;
		s.addremove = true;
		s.sortable = true;
		s.template = 'cbi/tblsection';

		s.tab('basic', _('Basic'));
		s.taboption('basic', form.Value, 'name', _('Name'), _('Section name and output filename base.')).rmempty = false;

		let enabled = s.taboption('basic', form.Flag, 'enabled', _('Enabled'));
		enabled.default = '1';
		enabled.rmempty = false;

		let type = s.taboption('basic', form.ListValue, 'type', _('Type'));
		type.value('client', 'client');
		type.value('server', 'server');
		type.value('http', 'http');
		type.value('irc', 'irc');
		type.value('streamr', 'streamr');
		type.default = 'client';

		s.tab('local', _('Local'));
		let addr = s.taboption('local', form.Value, 'address', _('Address'));
		addr.placeholder = '127.0.0.1';
		addr.rmempty = true;

		s.taboption('local', form.Value, 'port', _('Port')).rmempty = true;
		s.taboption('local', form.Value, 'inport', _('Inbound port')).rmempty = true;
		s.taboption('local', form.Value, 'host', _('Host')).rmempty = true;
		s.taboption('local', form.Value, 'webircpassword', _('WebIRC password')).rmempty = true;

		s.tab('remote', _('Remote'));
		s.taboption('remote', form.Value, 'destination', _('Destination')).rmempty = true;
		s.taboption('remote', form.Value, 'destinationport', _('Destination port')).rmempty = true;
		s.taboption('remote', form.Value, 'keys', _('Keys')).rmempty = true;
		s.taboption('remote', form.Value, 'signaturetype', _('Signature type')).rmempty = true;
		s.taboption('remote', form.Value, 'accesslist', _('Access list')).rmempty = true;

		s.tab('tunnels', _('Tunnel parameters'));
		s.taboption('tunnels', form.Value, 'inbound_length', _('Inbound length')).rmempty = true;
		s.taboption('tunnels', form.Value, 'inbound_quantity', _('Inbound quantity')).rmempty = true;
		s.taboption('tunnels', form.Value, 'inbound_lengthVariance', _('Inbound length variance')).rmempty = true;
		s.taboption('tunnels', form.Value, 'outbound_length', _('Outbound length')).rmempty = true;
		s.taboption('tunnels', form.Value, 'outbound_quantity', _('Outbound quantity')).rmempty = true;
		s.taboption('tunnels', form.Value, 'outbound_lengthVariance', _('Outbound length variance')).rmempty = true;

		s.tab('i2cp', _('I2CP / Streaming'));
		s.taboption('i2cp', form.Value, 'i2cp_leaseSetType', _('LeaseSet type')).rmempty = true;
		s.taboption('i2cp', form.Value, 'i2cp_leaseSetEncType', _('LeaseSet encryption type')).rmempty = true;
		s.taboption('i2cp', form.Value, 'i2cp_leaseSetPrivKey', _('LeaseSet private key')).rmempty = true;
		s.taboption('i2cp', form.Value, 'i2p_streaming_profile', _('Streaming profile')).rmempty = true;
		s.taboption('i2cp', form.Value, 'i2p_streaming_maxWindowSize', _('Streaming max window')).rmempty = true;
		s.taboption('i2cp', form.Value, 'i2p_streaming_maxOutboundSpeed', _('Max outbound speed')).rmempty = true;
		s.taboption('i2cp', form.Value, 'i2p_streaming_maxInboundSpeed', _('Max inbound speed')).rmempty = true;

		s.tab('advanced', _('Advanced'));
		s.taboption('advanced', form.Value, 'latency_min', _('Latency min')).rmempty = true;
		s.taboption('advanced', form.Value, 'latency_max', _('Latency max')).rmempty = true;
		s.taboption('advanced', form.Value, 'outproxy', _('Outproxy')).rmempty = true;
		s.taboption('advanced', form.Value, 'outproxyport', _('Outproxy port')).rmempty = true;

		let o_proxy = s.taboption('advanced', form.Flag, 'outproxy_enabled', _('Outproxy enabled'));
		o_proxy.rmempty = true;

		s.taboption('advanced', form.DynamicList, 'extra', _('Extra options'), _('One i2pd option per item, in key=value form.'));

		m.handleSaveApply = function(ev, mode) {
			return form.Map.prototype.handleSaveApply.call(this, ev, mode).then(function() {
				return rpc.declare({ object: 'luci.i2pd', method: 'restart', params: {} })();
			}).catch(function(err) {
				console.error(err);
			});
		};

		return m.render();
	}
});
