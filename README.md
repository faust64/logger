# Logger library - npmjs' wraplog

 * [![CircleCI](https://circleci.com/gh/faust64/logger.svg?style=svg)](https://circleci.com/gh/faust64/logger)

 * Install with:

```
sudo npm install -g node-gyp
npm install wraplog
```

Note `node-gyp` may be required running `npm rebuild` during post install, as
CircleCI did show errors such as `Module version mismatch. Expected 48, got 46.`
suggesting `winston-syslog` library install pulled some node4-based binary.
Failing to run post install won't block, yet may show an error on console.

 * Configure using:

```
# divert everything to console:
export DEBUG=whateverstringwoulddo

# to local syslog
export SYSLOG_FACILITY=local6
export SYSLOG_PROTO=unix
export SYSLOG_UNIX_SOCKET=/dev/log

# to remote syslog
export SYSLOG_FACILITY=local6
export SYSLOG_PROTO=udp
export SYSLOG_PROXY=rsyslog.example.com
export SYSLOG_PORT=514
```

 * Use it in place of `console.*`:

```
const logger = require('wraplog')('appname');
logger.info('foo');
logger.error('bar');
```
