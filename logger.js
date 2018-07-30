const winston =  require('winston');
const { format } = require('winston');
const { combine, timestamp, printf } = format;

var logger = (function () {

    info = function(message) {
        winston_logger.info(message);
    };

    warn = function(message) {
        winston_logger.warn(message);
    };

    error = function(message) {
        winston_logger.error(message);
    };

    const myFormat = printf(info => {
        return `${info.level}: ${info.message}`;
    });

    const winston_logger = winston.createLogger({
        format: combine(
            //timestamp(),
            myFormat
        ),
        transports: [
            new winston.transports.Console()
            // new winston.transports.File({
            //     filename: 'logs/info.log',
            //     level: 'info'
            // }),
            // new winston.transports.File({
            //     filename: 'logs/error.log',
            //     level: 'error'
            // })
        ]
    });

    return {
        info: info,
        warn: warn,
        error: error
    };

})();

module.exports = logger;