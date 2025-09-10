const cors = require('cors');

const corsConfig = cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    preflightContinue: false,
})

module.exports = corsConfig;
