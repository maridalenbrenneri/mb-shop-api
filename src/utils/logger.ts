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
    debug = function(message) {
        console.log("DEBUG " + message);
        winston_logger.debug(message);
    };

    info = function(message) {
        console.log("INFO " + message);
        winston_logger.info(message);
    };

    warn = function(message) {
        console.log("WARN " + message);
        winston_logger.warn(message);
    };

    error = function(message) {
        console.log("ERROR " + message);
        winston_logger.error(message);
    };
}

export default new Logger();