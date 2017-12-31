const winston = require('winston');

class myLogger {
    constructor(role, opts) {
	    const logTransports = [];
	    opts = opts || {};

	    if (opts.syslog === undefined && (opts.ci !== undefined || process.env.CIRCLECI || process.env.CI || process.env.JENKINS)) {
		logTransports.push(new winston.transports.File({ filename: './logs/' + role + '.log' }));
	    } else if (opts.syslog === undefined && (opts.debug !== undefined || process.env.DEBUG)) {
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
		    } else {
			syslogOptions.path = '/dev/log';
		    }
		} else {
		    syslogOptions.host = opts.proxy || process.env.SYSLOG_PROXY || 'localhost';
		    syslogOptions.port = opts.port || process.env.SYSLOG_PORT || 514;
		}
		require('winston-syslog').Syslog;
		logTransports.push(new winston.transports.Syslog(syslogOptions));
	    }
	    this._logger = new winston.Logger({ transports: logTransports });
	}

    get logger() {
	return this._logger;
    }
}

module.exports = (role, opts) => new myLogger(role, opts).logger;