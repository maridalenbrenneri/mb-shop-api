import * as winston from "winston";

const winston_logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({ level: process.env.NODE_ENV === "production" ? "info" : "debug" })
    ]
});

if (process.env.NODE_ENV !== "production") {
    winston_logger.debug("Logging initialized at debug level");
}

class Logger {
    info = function(message) {
        winston_logger.info(message);
    };

    warn = function(message) {
        winston_logger.warn(message);
    };

    error = function(message) {
        winston_logger.error(message);
    };
}

export default new Logger();