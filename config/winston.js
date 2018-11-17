// https://www.npmjs.com/package/winston-splunk-httplogger
const appRoot = require('app-root-path');
const winston = require('winston');
const SplunkStreamEvent = require('winston-splunk-httplogger');


// let splunkTcpserverlist = '';
// let splunkToken = '';

// if (process.env.VCAP_SERVICES) {
//   const dbLabel = 'splunk';
//   const env = JSON.parse(process.env.VCAP_SERVICES);
//   if (env[dbLabel]) {
//     splunkTcpserverlist = `https://${env[dbLabel][0].credentials.tcpserverlist}`;
//     splunkToken = env[dbLabel][0].credentials.token;
//   }
// }

const tsFormat = () => (new Date()).toLocaleTimeString();

// define the custom settings for each transport (file, console)
const options = {
  file: {
    timestamp: tsFormat,
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    // timestamp: tsFormat,
  },
  // splunk: {
  //   url: splunkTcpserverlist,
  //   token: splunkToken,
  // },
};

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(options.console),
  ],
});

if (process.env.NODE_ENV === 'production') {
  // logger.add(new SplunkStreamEvent({ splunk: options.splunk }));
} else {
  logger.add(new winston.transports.File(options.file));
}

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
