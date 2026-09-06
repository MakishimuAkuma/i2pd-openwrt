'use strict';
'require view';
'require form';
'require rpc';

const callRestart = rpc.declare({
	object: 'luci.i2pd',
	method: 'restart'
});

function flag(s, tab, name, title, description, def) {
	let o = s.taboption(tab, form.Flag, name, title, description);
	o.default = def;
	return o;
}

function value(s, tab, name, title, description, def) {
	let o = s.taboption(tab, form.Value, name, title, description);
	o.placeholder = def;
	o.default = def;
	return o;
}

return view.extend({
	render: function() {
		let m = new form.Map('i2pd', _('i2pd'), _('Configure the i2pd router and its network interfaces.'));
		let s = m.section(form.NamedSection, 'main', 'i2pd', _('i2pd'));
		s.anonymous = false;
		s.addremove = false;

		s.tab('general', _('General'));
		value(s, 'general', 'data_dir', _('Data directory'), _('Persistent i2pd data directory. Use RAM or extroot when appropriate.'), '/etc/i2pd');
		value(s, 'general', 'netdb_dir', _('NetDB directory'), _('Path to the network database directory.'), '/etc/i2pd/netDb');
		value(s, 'general', 'addressbook_dir', _('Addressbook directory'), _('Path to the local address book storage.'), '/etc/i2pd/addressbook');

		value(s, 'general', 'bandwidth', _('Bandwidth'), _('i2pd bandwidth class, for example L, M, N or O.'), 'X');
		value(s, 'general', 'share', _('Transit share (%)'), null, '100');
		value(s, 'general', 'netid', _('Network ID'), null, '2');
		flag(s, 'general', 'ipv4', _('IPv4'), null, '1');
		flag(s, 'general', 'ipv6', _('IPv6'), null, '0');
		flag(s, 'general', 'nat', _('NAT mode'), null, '1');
		flag(s, 'general', 'reservedrange', _('Reserved ranges'), null, '1');
		flag(s, 'general', 'notransit', _('Disable transit'), null, '0');
		flag(s, 'general', 'floodfill', _('Floodfill'), null, '0');
		flag(s, 'general', 'stan', _('STAN'), null, '0');
		flag(s, 'general', 'daemon', _('Daemon mode'), null, '1');
		value(s, 'general', 'family', _('Family'), null, '');
		value(s, 'general', 'host', _('Published host'), null, '');
		value(s, 'general', 'port', _('Published port'), null, '');
		value(s, 'general', 'address4', _('IPv4 address'), null, '');
		value(s, 'general', 'address6', _('IPv6 address'), null, '');
		value(s, 'general', 'ifname', _('Interface'), null, '');
		value(s, 'general', 'ifname4', _('IPv4 interface'), null, '');
		value(s, 'general', 'ifname6', _('IPv6 interface'), null, '');

		s.tab('logging', _('Logging'));
		value(s, 'logging', 'log', _('Log target'), null, 'stdout');
		value(s, 'logging', 'logfile', _('Log file'), null, '/var/log/i2pd.log');
		value(s, 'logging', 'loglevel', _('Log level'), null, 'warn');
		flag(s, 'logging', 'logclftime', _('CLF timestamps'), null, '0');

		s.tab('transports', _('Transports'));
		flag(s, 'transports', 'ntcp2_enabled', _('NTCP2 enabled'), null, '1');
		flag(s, 'transports', 'ntcp2_published', _('NTCP2 published'), null, '1');
		value(s, 'transports', 'ntcp2_port', _('NTCP2 port'), _('Leave blank for automatic global port.'), '');
		value(s, 'transports', 'ntcp2_addressv6', _('NTCP2 IPv6 address'), null, '');
		value(s, 'transports', 'ntcp2_proxy', _('NTCP2 proxy'), null, '');
		value(s, 'transports', 'ntcp2_version', _('NTCP2 version'), null, '4');
		flag(s, 'transports', 'ssu2_enabled', _('SSU2 enabled'), null, '1');
		flag(s, 'transports', 'ssu2_published', _('SSU2 published'), null, '1');
		value(s, 'transports', 'ssu2_port', _('SSU2 port'), _('Leave blank for automatic global port.'), '');
		value(s, 'transports', 'ssu2_proxy', _('SSU2 proxy'), null, '');
		value(s, 'transports', 'ssu2_mtu4', _('SSU2 MTU4'), null, '');
		value(s, 'transports', 'ssu2_mtu6', _('SSU2 MTU6'), null, '');
		flag(s, 'transports', 'ssu2_firewalled4', _('SSU2 firewalled IPv4'), null, '0');
		flag(s, 'transports', 'ssu2_firewalled6', _('SSU2 firewalled IPv6'), null, '0');
		value(s, 'transports', 'ssu2_version', _('SSU2 version'), null, '2');

		s.tab('http', _('HTTP console'));
		flag(s, 'http', 'http_enabled', _('Enabled'), null, '1');
		value(s, 'http', 'http_address', _('Address'), null, '192.168.1.1');
		value(s, 'http', 'http_port', _('Port'), null, '7070');
		flag(s, 'http', 'http_auth', _('Authentication'), null, '0');
		value(s, 'http', 'http_user', _('User'), null, 'i2pd');
		value(s, 'http', 'http_pass', _('Password'), null, '').password = true;
		flag(s, 'http', 'http_strictheaders', _('Strict headers'), null, '1');
		value(s, 'http', 'http_hostname', _('Hostname'), null, 'localhost');
		flag(s, 'http', 'http_showTotalTCSR', _('Show total TCSR'), null, '0');
		value(s, 'http', 'http_webroot', _('Web root'), null, '/');
		value(s, 'http', 'http_lang', _('Language'), null, 'english');
		value(s, 'http', 'http_theme', _('Theme'), null, 'light');

		s.tab('proxies', _('Proxies'));
		flag(s, 'proxies', 'httpproxy_enabled', _('HTTP proxy enabled'), null, '1');
		value(s, 'proxies', 'httpproxy_address', _('HTTP proxy address'), null, '192.168.1.1');
		value(s, 'proxies', 'httpproxy_port', _('HTTP proxy port'), null, '4444');
		value(s, 'proxies', 'httpproxy_keys', _('HTTP proxy keys'), null, '');
		value(s, 'proxies', 'httpproxy_signaturetype', _('HTTP proxy signature type'), null, '7');
		value(s, 'proxies', 'httpproxy_inbound_length', _('HTTP inbound length'), null, '3');
		value(s, 'proxies', 'httpproxy_inbound_quantity', _('HTTP inbound quantity'), null, '5');
		value(s, 'proxies', 'httpproxy_inbound_lengthVariance', _('HTTP inbound length variance'), null, '0');
		value(s, 'proxies', 'httpproxy_outbound_length', _('HTTP outbound length'), null, '3');
		value(s, 'proxies', 'httpproxy_outbound_quantity', _('HTTP outbound quantity'), null, '5');
		value(s, 'proxies', 'httpproxy_outbound_lengthVariance', _('HTTP outbound length variance'), null, '0');
		value(s, 'proxies', 'httpproxy_outproxy', _('HTTP outproxy'), null, '');
		flag(s, 'proxies', 'httpproxy_addresshelper', _('HTTP address helper'), null, '1');
		flag(s, 'proxies', 'httpproxy_senduseragent', _('Send user agent'), null, '0');
		value(s, 'proxies', 'httpproxy_i2cp_leaseSetType', _('HTTP LeaseSet type'), null, '3');
		value(s, 'proxies', 'httpproxy_i2p_streaming_profile', _('HTTP streaming profile'), null, '1');
		value(s, 'proxies', 'httpproxy_i2p_streaming_maxWindowSize', _('HTTP streaming window'), null, '512');
		value(s, 'proxies', 'httpproxy_latency_min', _('HTTP latency min'), null, '0');
		value(s, 'proxies', 'httpproxy_latency_max', _('HTTP latency max'), null, '0');
		value(s, 'proxies', 'httpproxy_i2p_streaming_maxOutboundSpeed', _('HTTP max outbound speed'), null, '1730000000');
		value(s, 'proxies', 'httpproxy_i2p_streaming_maxInboundSpeed', _('HTTP max inbound speed'), null, '1730000000');

		flag(s, 'proxies', 'socksproxy_enabled', _('SOCKS proxy enabled'), null, '1');
		value(s, 'proxies', 'socksproxy_address', _('SOCKS address'), null, '192.168.1.1');
		value(s, 'proxies', 'socksproxy_port', _('SOCKS port'), null, '4447');
		value(s, 'proxies', 'socksproxy_keys', _('SOCKS keys'), null, '');
		value(s, 'proxies', 'socksproxy_signaturetype', _('SOCKS signature type'), null, '7');
		value(s, 'proxies', 'socksproxy_inbound_length', _('SOCKS inbound length'), null, '3');
		value(s, 'proxies', 'socksproxy_inbound_quantity', _('SOCKS inbound quantity'), null, '5');
		value(s, 'proxies', 'socksproxy_outbound_length', _('SOCKS outbound length'), null, '3');
		value(s, 'proxies', 'socksproxy_outbound_quantity', _('SOCKS outbound quantity'), null, '5');
		flag(s, 'proxies', 'socksproxy_outproxy_enabled', _('SOCKS outproxy enabled'), null, '0');
		value(s, 'proxies', 'socksproxy_outproxy', _('SOCKS outproxy'), null, '192.168.1.1');
		value(s, 'proxies', 'socksproxy_outproxyport', _('SOCKS outproxy port'), null, '9050');

		s.tab('interfaces', _('Interfaces'));
		flag(s, 'interfaces', 'sam_enabled', _('SAM enabled'), null, '0');
		value(s, 'interfaces', 'sam_address', _('SAM address'), null, '192.168.1.1');
		value(s, 'interfaces', 'sam_port', _('SAM port'), null, '7656');
		value(s, 'interfaces', 'sam_portudp', _('SAM UDP port'), null, '7655');
		flag(s, 'interfaces', 'sam_singlethread', _('SAM single thread'), null, '1');
		flag(s, 'interfaces', 'bob_enabled', _('BOB enabled'), null, '0');
		value(s, 'interfaces', 'bob_address', _('BOB address'), null, '192.168.1.1');
		value(s, 'interfaces', 'bob_port', _('BOB port'), null, '2827');
		flag(s, 'interfaces', 'i2cp_enabled', _('I2CP enabled'), null, '0');
		value(s, 'interfaces', 'i2cp_address', _('I2CP address'), null, '192.168.1.1');
		value(s, 'interfaces', 'i2cp_port', _('I2CP port'), null, '7654');
		flag(s, 'interfaces', 'i2pcontrol_enabled', _('I2PControl enabled'), null, '0');
		value(s, 'interfaces', 'i2pcontrol_address', _('I2PControl address'), null, '192.168.1.1');
		value(s, 'interfaces', 'i2pcontrol_port', _('I2PControl port'), null, '7650');
		value(s, 'interfaces', 'i2pcontrol_password', _('I2PControl password'), null, 'itoopie').password = true;

		m.handleSaveApply = function(ev, mode) {
			return form.Map.prototype.handleSaveApply.call(this, ev, mode)
			.then(function() {
				return callRestart();
			})
			.then(function(result) {
				if (!result || !result.ok)
					throw new Error(_('Failed to restart i2pd'));

				return result;
			});
		};

		return m.render();
	}
});
