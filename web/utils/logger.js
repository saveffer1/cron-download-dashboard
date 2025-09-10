const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const env = require('./config');

const logger = winston.createLogger({
    /**
     * Configured Winston logger for logging messages with different formats and transports.
     *
     * @constant
     *
     * @property {string} level - The logging level for the logger. Messages with this level and above will be logged.
     * @property {winston.Format} format - The format of the log messages.
     * @property {Array<winston.transport>} transports - The transports where the logs will be sent.
     *
     * @property {winston.format.Format} format.timestamp - Adds a timestamp to each log message.
     * @property {winston.format.Format} format.printf - Formats the log message into a string with timestamp and log level.
     * @property {winston.format.Format} format.json - Serializes the log message as JSON.
     *
     * @property {boolean} isProduction - Flag indicating if the environment is production. Determines whether to include console transport.
     *
     * @property {object} transports.Console - Console transport for logging to the terminal.
     * @property {object} transports.DailyRotateFile - DailyRotateFile transport for rotating log files.
     * @property {string} transports.DailyRotateFile.filename - The file name pattern for log files.
     * @property {string} transports.DailyRotateFile.datePattern - The pattern for the date in log file names.
     * @property {boolean} transports.DailyRotateFile.zippedArchive - Whether to zip archived log files.
     * @property {string} transports.DailyRotateFile.maxSize - The maximum size of a log file before it rotates.
     * @property {string} transports.DailyRotateFile.maxFiles - The maximum number of days to keep log files.
     *
     * @see {@link https://github.com/winstonjs/winston}
     * */
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'DD-MM-YYYY-HH:mm:ss'
        }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        }),
        winston.format.json(),
    ),
    transports: [
        ...(env.isProduction ? [] : [new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'HH:mm:ss'
                }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
                }),
            ),
        })]),
        new DailyRotateFile({
            filename: 'logs/web-service-%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '4096m',
            maxFiles: '90d',
        }),
    ],
});


module.exports = logger;