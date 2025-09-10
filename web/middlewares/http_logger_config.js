
const morgan = require('morgan');
const logger = require('../utils/logger');

// Create a stream for Morgan to use Winston
const stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

const morganConfig = function (tokens, req, res) {
   /**
    * Custom Morgan format function for logging HTTP requests.
    *
    * @function
    * @param {Function} tokens - Function to get various tokens related to the request and response.
    * @param {object} req - The Express request object.
    * @param {object} res - The Express response object.
    * * @returns {string} - The formatted log string.
    * * @property {string} method - The HTTP method of the request (e.g., GET, POST).
    * @property {string} url - The URL of the request.
    * @property {string} status - The HTTP status code of the response.
    * @property {string} contentLength - The content length of the response in bytes.
    * @property {string} responseTime - The time taken to respond to the request in milliseconds.
    * @property {string} ip - The IP address of the client making the request.
    *
    * @see {@link https://github.com/expressjs/morgan}
    * */ 
    const method = tokens.method ? tokens.method(req, res) : 'N/A';
    const url = tokens.url ? tokens.url(req, res) : 'N/A';
    const status = tokens.status ? tokens.status(req, res) : 'N/A';
    const contentLength = tokens.res ? tokens.res(req, res, 'content-length') || '0' : 'N/A';
    const responseTime = tokens['response-time'] ? tokens['response-time'](req, res) : 'N/A';
    const ip = req.ip || req.socket.remoteAddress;

    return [
        'IP: ' + ip,
        method,
        url,
        'status: '+ status,
        'lenght:', contentLength, 'bytes',
        responseTime, 'ms'
    ].join(' ');
};

// Create a middleware function using Morgan and stream for Winston
const httpLogger = morgan(morganConfig, {
    stream,
});

module.exports = httpLogger;
