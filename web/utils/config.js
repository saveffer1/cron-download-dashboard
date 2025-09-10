const { cleanEnv, str, num, bool } = require("envalid");

const env = cleanEnv(process.env, {
    NODE_ENV: str({ default: 'development', choices: ["development", "production", "test"] }),
    PORT: num({ default: 80}),
    ADMIN_PASSWORD: str({default: 'password'}),
    SESSION_SECRET: str({default: 'secret'}),
    DB_URL: str({default: 'postgres://user:password@localhost:5432/cronjob_db'}),
    DB_HOST: str({default: 'localhost'}),
    DB_USER: str({default: 'user'}),
    DB_PASSWORD: str({default: 'password'}),
});

module.exports = env;