const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');

const corsConfig = require('./middlewares/cors_config');
const helmetConfig = require('./middlewares/helmet_config');
const rateLimitConfig = require('./middlewares/limit_config');
const httpLogger = require('./middlewares/http_logger_config');
const logger = require('./utils/logger');

const apiRouter = require('./routes/api_router');
const dashboardRouter = require('./routes/dashboard_router');

function createApp() {
    const app = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'njk');

    app.use(express.static(path.join(__dirname, 'public')));

    app.disable('x-powered-by');

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(corsConfig);
    app.use(helmetConfig);
    app.use(rateLimitConfig);
    app.use(httpLogger);

    app.get('/', (req, res) => {
        res.redirect('/dashboard');
    });

    app.use('/dashboard', dashboardRouter);
    app.use('/api', apiRouter);

    app.use(async (req, res) => {
        res.status(404).json({ message: 'Not Found' });
    })

    app.use(async (error, req, res) => {
        logger.error(error.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    })

    return app;
}

const app = createApp();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});

module.exports = app;