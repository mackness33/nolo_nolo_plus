const pretty = require('pino-pretty');
const pino = require('pino')(pretty());

// pino.info('testing info pino');
// pino.warn('testing warn pino');
// pino.debug('testing debug pino');
// pino.error(new Error('testing error pino'));
// pino.trace(new Error('testing trace pino'));
// pino.fatal(new Error('testing fatal pino'));


module.exports = pino;
