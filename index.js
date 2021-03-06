class myLogger {
    constructor(role, opts) {
	    opts = opts || {};
	    if (opts.console !== undefined || process.env.LOG_TO_CONSOLE) {
		this._logger = {
			debug: (...msg)  => { if (process.env.DEBUG) { console.log(...msg); } },
			error: (...msg) => { console.error(...msg); },
			info: (...msg)  => { console.log(...msg); }
		    };
	    } else {
		const winston = require('winston');
		const logTransports = [];

		if (opts.ci !== undefined) {
		    logTransports.push(new winston.transports.File({ filename: './logs/' + role + '.log' }));
		} else if (opts.debug !== undefined || process.env.DEBUG) {
		    logTransports.push(new winston.transports.Console({ colorize: true }));
		} else {
		    const syslogOptions = {
			app_name: role || 'standalone',
			facility: opts.facility || process.env.SYSLOG_FACILITY || 'local6',
			humanReadableUnhandledException: true,
			localhost: false,
			protocol: opts.proto || process.env.SYSLOG_PROTO || 'unix'
		    };

		    if (syslogOptions.protocol === 'unix') {
			if (process.env.SYSLOG_UNIX_SOCKET) {
			    syslogOptions.path = process.env.SYSLOG_UNIX_SOCKET;
			} else if (require('os').platform() === 'darwin') {
			    syslogOptions.path = '/var/run/syslog';
			} else { syslogOptions.path = '/dev/log'; }
		    } else {
			syslogOptions.host = opts.proxy || process.env.SYSLOG_PROXY || 'localhost';
			syslogOptions.port = opts.port || process.env.SYSLOG_PORT || 514;
		    }
		    require('winston-syslog').Syslog;
		    let prepTransport = new winston.transports.Syslog(syslogOptions);
		    prepTransport.handleExceptions = (e) => { console.error('logger caught error:', JSON.stringify(e)); };
		    logTransports.push(prepTransport);
		}
		try {
		    this._logger = new winston.createLogger({ transports: logTransports });
		} catch(e) { console.error('caught error initializing logger:', JSON.stringify(e)); }
	    }
	}

    get logger() { return this._logger; }
}

module.exports = (role, opts) => new myLogger(role, opts).logger;
