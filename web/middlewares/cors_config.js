const cors = require('cors');
const env = require('../utils/config');

const corsConfig = cors({
    origin: [`http://localhost:${env.PORT}`, `http://${env.APP_HOST}:${env.PORT}`],
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    preflightContinue: false,
})

module.exports = corsConfig;