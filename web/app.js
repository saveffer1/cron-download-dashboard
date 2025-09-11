const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const csurf = require('csurf');

const corsConfig = require('./middlewares/cors_config');
const helmetConfig = require('./middlewares/helmet_config');

const rateLimitConfig = require('./middlewares/limit_config');
const httpLogger = require('./middlewares/http_logger_config');
const logger = require('./utils/logger');

const apiRouter = require('./routes/api_router');
const authRouter = require('./routes/auth_router');
const dashboardRouter = require('./routes/dashboard_router');
const contentRouter = require('./routes/content_router'); // New

function createApp() {
    const app = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'njk');

    app.use(express.static(path.join(__dirname, 'public')));

    app.disable('x-powered-by');

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use(helmetConfig);
    app.use(rateLimitConfig);
    app.use(httpLogger);

    app.get('/', (req, res) => {
        res.redirect('/dashboard');
    });

    
        const session = require('express-session');
    const KnexSessionStore = require('connect-session-knex')(session);
    const knex = require('./utils/db');
    const env = require('./utils/config');

    const store = new KnexSessionStore({
        knex,
        tablename: 'sessions',
    });

    app.use(session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store,
    }));

    // Auth routes (no CSRF)
    app.use('/api/auth', authRouter);

    // CSRF Protection
    const csrfProtection = csurf();
    app.use(csrfProtection);

    app.get('/api/csrf-token', (req, res) => {
        res.json({ csrfToken: req.csrfToken() });
    });

    app.use('/dashboard', dashboardRouter);
    app.use('/dashboard/content', contentRouter);
    app.use('/api', apiRouter);

    app.use(async (req, res) => {
        res.status(404).json({ message: 'Not Found' });
    })

    app.use(async (error, req, res, next) => {
        if (error.code === 'EBADCSRFTOKEN') {
            res.status(403).json({ error: 'Invalid CSRF token' });
        } else {
            logger.error(error.stack);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    return app;
}

const app = createApp();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});

module.exports = app;
