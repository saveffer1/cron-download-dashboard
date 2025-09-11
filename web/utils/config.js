const { cleanEnv, str, num, bool } = require("envalid");

const env = cleanEnv(process.env, {
    NODE_ENV: str({ default: 'development', choices: ["development", "production", "test"] }),
    PORT: num({ default: 80}),
    ADMIN_PASSWORD: str(),
    SESSION_SECRET: str(),
    DB_URL: str(),
    DB_HOST: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    APP_HOST: str({ default: 'localhost' }),
});

module.exports = env;