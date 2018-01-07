describe('test logger', () => {
	it('logs to console', (done) => {
		let log1 = require('../index.js')('test1', { debug: true });
		try {
		    log1.info('can write info');
		    log1.error('can write error');
		    log1.debug('can write debug');
		    done()
		} catch(e) { done(e); }
	    });
	it('logs to file', (done) => {
		let log2 = require('../index.js')('test2', { ci: true });
		try {
		    log2.info('can write info');
		    log2.error('can write error');
		    log2.debug('can write debug');
		    done()
		} catch(e) { done(e); }
	    });
	it('logs to syslog', (done) => {
		let log3 = require('../index.js', { syslog: true })('test3');
		try {
		    log3.info('can write info');
		    log3.error('can write error');
		    log3.debug('can write debug');
		    done()
		} catch(e) { done(e); }
	    });
    });
