'use strict';
'require view';
'require form';
'require rpc';

const callRestart = rpc.declare({
	object: 'luci.i2pd',
	method: 'restart'
});

function addSection(map, title) {
	let s = map.section(form.TypedSection, 'i2pd', title);
	s.anonymous = true;
	s.addremove = false;
	return s;
}

function addFlag(section, name, title, def, description) {
	let o = section.option(form.Flag, name, title);

	if (def !== undefined)
		o.default = def;

	if (description)
		o.description = description;

	return o;
}

function addValue(section, name, title, def, datatype, description) {
	let o = section.option(form.Value, name, title);

	if (def !== undefined)
		o.default = def;

	if (datatype)
		o.datatype = datatype;

	if (description)
		o.description = description;

	return o;
}

function addPort(section, name, title, def) {
	return addValue(section, name, title, def, 'port');
}

return view.extend({
	render: function() {
		let m, s, o;

		m = new form.Map(
			'i2pd',
			_('i2pd'),
						 _('Configure the i2pd router.')
		);

		s = addSection(m, _('General'));

		addValue(
			s,
		   'data_dir',
		   _('Data directory'),
				 '/var/lib/i2pd',
		   null,
		   _('OpenWrt-specific directory used as i2pd --datadir.')
		);

		addValue(
			s,
		   'netdb_dir',
		   _('NetDB directory'),
				 '/var/lib/i2pd/netDb'
		);

		addValue(
			s,
		   'addressbook_dir',
		   _('Addressbook directory'),
				 '/var/lib/i2pd/addressbook'
		);

		addValue(
			s,
		   'tunnelsdir',
		   _('Tunnels directory'),
				 '/etc/i2pd/tunnels.d'
		);

		addValue(
			s,
		   'certsdir',
		   _('Certificates directory'),
				 '/usr/share/i2pd/certificates'
		);

		addValue(
			s,
			'pidfile',
			_('PID file'),
				 '/var/run/i2pd.pid'
		);

		addValue(
			s,
			'family',
			_('Family')
		);

		addValue(
			s,
			'ifname',
			_('Network interface')
		);

		addValue(
			s,
			'ifname4',
			_('IPv4 interface')
		);

		addValue(
			s,
			'ifname6',
			_('IPv6 interface')
		);

		addValue(
			s,
			'address4',
			_('IPv4 bind address')
		);

		addValue(
			s,
			'address6',
			_('IPv6 bind address')
		);

		addValue(
			s,
			'host',
			_('External address'),
				 null,
				 null,
				 _('External IPv4 or IPv6 address published by i2pd.')
		);

		addPort(
			s,
			'port',
			_('Transport port'),
				null
		);

		addFlag(
			s,
			'ipv4',
			_('Enable IPv4'),
				'1'
		);

		addFlag(
			s,
			'ipv6',
			_('Enable IPv6'),
				'0'
		);

		o = s.option(form.ListValue, 'bandwidth', _('Bandwidth'));

		o.value('L', 'L');
		o.value('O', 'O');
		o.value('P', 'P');
		o.value('X', 'X');

		o.default = 'L';

		o.description = _(
			'L = 32 KB/s, O = 256 KB/s, P = 2048 KB/s, X = unlimited. ' +
			'An integer value in KB/s is also supported.'
		);

		addValue(
			s,
			'share',
			_('Transit share (%)'),
				 '100',
				 'range(0,100)'
		);

		addFlag(
			s,
			'notransit',
			_('Disable transit'),
				'0'
		);

		addFlag(
			s,
			'floodfill',
			_('Floodfill'),
				'0',
				_('Floodfill mode uses significantly more network connections and CPU.')
		);

		addFlag(
			s,
			'stan',
			_('STAN'),
				'0',
				_('Enable STAN mode for limited connectivity.')
		);

		s = addSection(m, _('Logging'));

		o = s.option(form.ListValue, 'log', _('Log destination'));

		o.value('stdout', 'stdout');
		o.value('file', 'file');
		o.value('syslog', 'syslog');

		o.default = 'stdout';

		addValue(
			s,
			'logfile',
			_('Log file'),
				 '/var/log/i2pd/i2pd.log'
		);

		o = s.option(form.ListValue, 'loglevel', _('Log level'));

		o.value('debug', 'debug');
		o.value('info', 'info');
		o.value('warn', 'warn');
		o.value('error', 'error');
		o.value('critical', 'critical');
		o.value('none', 'none');

		o.default = 'info';

		addFlag(
			s,
			'logclftime',
			_('CLF timestamps'),
				'0'
		);


		s = addSection(m, _('NTCP2'));

		addFlag(
			s,
			'ntcp2_enabled',
			_('Enabled'),
				'1'
		);

		addFlag(
			s,
			'ntcp2_published',
			_('Published'),
				'1'
		);

		addPort(
			s,
			'ntcp2_port',
			_('Port')
		);

		s = addSection(m, _('SSU2'));

		addFlag(
			s,
			'ssu2_enabled',
			_('Enabled'),
				'1'
		);

		addFlag(
			s,
			'ssu2_published',
			_('Published'),
				'1'
		);

		addPort(
			s,
			'ssu2_port',
			_('Port')
		);

		s = addSection(m, _('HTTP'));

		addFlag(
			s,
			'http_enabled',
			_('Enabled'),
				'1'
		);

		addValue(
			s,
			'http_address',
			_('Address'),
				 '127.0.0.1'
		);

		addPort(
			s,
			'http_port',
			_('Port'),
				'7070'
		);

		addValue(
			s,
			'http_webroot',
			_('Web root'),
				 '/'
		);

		addFlag(
			s,
			'http_auth',
			_('Authentication'),
				'0'
		);

		addValue(
			s,
			'http_user',
			_('Username'),
				 'i2pd'
		);

		o = addValue(
			s,
			'http_pass',
			_('Password'),
					 'changeme'
		);

		o.password = true;

		o = addValue(
			s,
			'http_lang',
			_('Language'),
					 'english'
		);

		s = addSection(m, _('HTTP Proxy'));

		addFlag(
			s,
			'httpproxy_enabled',
			_('Enabled'),
				'1'
		);

		addValue(
			s,
			'httpproxy_address',
			_('Address'),
				 '127.0.0.1'
		);

		addPort(
			s,
			'httpproxy_port',
			_('Port'),
				'4444'
		);

		addValue(
			s,
			'httpproxy_keys',
			_('Keys file'),
				 'http-proxy-keys.dat'
		);

		addFlag(
			s,
			'httpproxy_addresshelper',
			_('Address helper'),
				'1'
		);

		addValue(
			s,
			'httpproxy_outproxy',
			_('Outproxy'),
				 'http://false.i2p'
		);

		s = addSection(m, _('SOCKS Proxy'));

		addFlag(
			s,
			'socksproxy_enabled',
			_('Enabled'),
				'1'
		);

		addValue(
			s,
			'socksproxy_address',
			_('Address'),
				 '127.0.0.1'
		);

		addPort(
			s,
			'socksproxy_port',
			_('Port'),
				'4447'
		);

		addValue(
			s,
			'socksproxy_keys',
			_('Keys file'),
				 'socks-proxy-keys.dat'
		);

		addFlag(
			s,
			'socksproxy_outproxy_enabled',
			_('Outproxy enabled'),
				'0'
		);

		addValue(
			s,
			'socksproxy_outproxy',
			_('Outproxy address'),
				 '127.0.0.1'
		);

		addPort(
			s,
			'socksproxy_outproxyport',
			_('Outproxy port'),
				'9050'
		);

		s = addSection(m, _('SAM'));

		addFlag(
			s,
			'sam_enabled',
			_('Enabled'),
				'0'
		);

		addValue(
			s,
			'sam_address',
			_('Address'),
				 '127.0.0.1'
		);

		addPort(
			s,
			'sam_port',
			_('TCP port'),
				'7656'
		);

		addPort(
			s,
		  'sam_portudp',
		  _('UDP port'),
				'7655'
		);

		s = addSection(m, _('BOB'));

		addFlag(
			s,
		  'bob_enabled',
		  _('Enabled'),
				'0'
		);

		addValue(
			s,
		   'bob_address',
		   _('Address'),
				 '127.0.0.1'
		);

		addPort(
			s,
		  'bob_port',
		  _('Port'),
				'2827'
		);

		s = addSection(m, _('I2CP'));

		addFlag(
			s,
		  'i2cp_enabled',
		  _('Enabled'),
				'0'
		);

		addValue(
			s,
		   'i2cp_address',
		   _('Address'),
				 '127.0.0.1'
		);

		addPort(
			s,
		  'i2cp_port',
		  _('Port'),
				'7654'
		);

		s = addSection(m, _('I2PControl'));

		addFlag(
			s,
		  'i2pcontrol_enabled',
		  _('Enabled'),
				'0'
		);

		addValue(
			s,
		   'i2pcontrol_address',
		   _('Address'),
				 '127.0.0.1'
		);

		addPort(
			s,
		  'i2pcontrol_port',
		  _('Port'),
				'7650'
		);

		o = addValue(
			s,
			'i2pcontrol_password',
			_('Password'),
					 'itoopie'
		);

		o.password = true;

		s = addSection(m, _('Precomputation'));

		addFlag(
			s,
		  'precomputation_elgamal',
		  _('ElGamal precomputation'),
				'0'
		);

		s = addSection(m, _('UPnP'));

		addFlag(
			s,
		  'upnp_enabled',
		  _('Enabled'),
				'0'
		);

		addValue(
			s,
		   'upnp_name',
		   _('Name'),
				 'I2Pd'
		);

		s = addSection(m, _('Meshnets'));

		addFlag(
			s,
		  'meshnets_yggdrasil',
		  _('Yggdrasil'),
				'0'
		);

		addValue(
			s,
		   'meshnets_yggaddress',
		   _('Yggdrasil address')
		);

		s = addSection(m, _('Reseed'));

		addFlag(
			s,
		  'reseed_verify',
		  _('Verify certificates'),
				'1'
		);

		addValue(
			s,
		   'reseed_urls',
		   _('Reseed URLs'),
				 'https://reseed.i2p-projekt.de/,https://i2p.mooo.com/netDb/,https://netdb.i2p2.no/'
		);

		addValue(
			s,
		   'reseed_yggurls',
		   _('Yggdrasil reseed URLs'),
				 'http://[324:71e:281a:9ed3::ace]:7070/'
		);

		addValue(
			s,
		   'reseed_file',
		   _('Local reseed file')
		);

		addValue(
			s,
		   'reseed_zipfile',
		   _('Reseed ZIP file')
		);

		addValue(
			s,
		   'reseed_proxy',
		   _('Reseed proxy')
		);

		addValue(
			s,
		   'reseed_threshold',
		   _('Threshold'),
				 '25',
		   'uinteger'
		);

		addFlag(
			s,
		  'reseed_followredirect',
		  _('Follow redirects'),
				'0'
		);

		s = addSection(m, _('Addressbook'));

		addValue(
			s,
		   'addressbook_defaulturl',
		   _('Default URL'),
				 'http://shx5vqsw7usdaunyzr2qmes2fq37oumybpudrd4jjj4e4vk4uusa.b32.i2p/hosts.txt'
		);

		addValue(
			s,
		   'addressbook_subscriptions',
		   _('Subscriptions'),
				 'http://reg.i2p/hosts.txt,http://identiguy.i2p/hosts.txt,http://stats.i2p/cgi-bin/newhosts.txt'
		);

		s = addSection(m, _('Limits'));

		addValue(
			s,
		   'limits_transittunnels',
		   _('Transit tunnels'),
				 '25000',
		   'uinteger'
		);

		addValue(
			s,
		   'limits_openfiles',
		   _('Open files'),
				 '0',
		   'uinteger'
		);

		addValue(
			s,
		   'limits_coresize',
		   _('Core size (KB)'),
				 '0',
		   'uinteger'
		);

		s = addSection(m, _('Trust'));

		addFlag(
			s,
		  'trust_enabled',
		  _('Enabled'),
				'0'
		);

		addValue(
			s,
		   'trust_family',
		   _('Family')
		);

		addValue(
			s,
		   'trust_routers',
		   _('Trusted routers'),
				 null,
		   null,
		   _('Comma-separated base64 router identities.')
		);

		addFlag(
			s,
		  'trust_hidden',
		  _('Hidden'),
				'0'
		);

		s = addSection(m, _('Exploratory'));

		addValue(
			s,
		   'exploratory_inbound_length',
		   _('Inbound length'),
				 '2',
		   'uinteger'
		);

		addValue(
			s,
		   'exploratory_inbound_quantity',
		   _('Inbound quantity'),
				 '3',
		   'uinteger'
		);

		addValue(
			s,
		   'exploratory_outbound_length',
		   _('Outbound length'),
				 '2',
		   'uinteger'
		);

		addValue(
			s,
		   'exploratory_outbound_quantity',
		   _('Outbound quantity'),
				 '3',
		   'uinteger'
		);

		s = addSection(m, _('Persist'));

		addFlag(
			s,
		  'persist_profiles',
		  _('Profiles'),
				'1'
		);

		addFlag(
			s,
		  'persist_addressbook',
		  _('Addressbook'),
				'1'
		);

		s = addSection(m, _('Advanced'));

		addFlag(
			s,
		  'daemon',
		  _('Daemon mode'),
				'0',
		  _('Keep disabled. OpenWrt procd manages the i2pd process.')
		);

		m.handleSaveApply = function(ev, mode) {
			return form.Map.prototype.handleSaveApply.call(this, ev, mode)
			.then(function() {
				return callRestart();
			})
			.then(function(result) {
				if (!result || result.ok !== true)
					throw new Error(_('i2pd restart failed'));

				L.ui.addNotification(
					null,
					E('p', _('i2pd restarted successfully.')),
									 'info'
				);

				return result;
			})
			.catch(function(err) {
				L.ui.addNotification(
					null,
					E(
						'p',
	   _('Failed to restart i2pd: ') +
	   (err && err.message ? err.message : err)
					),
					'error'
				);

				throw err;
			});
		};

		return m.render();
	}
});
