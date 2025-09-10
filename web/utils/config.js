const { cleanEnv, str, num, bool } = require("envalid");

const env = cleanEnv(process.env, {
    NODE_ENV: str({ default: 'development', choices: ["development", "production", "test"] }),
    PORT: num({ default: 80}),
    ADMIN_PASSWORD: str({default: 'strongpassword123'}),
    SESSION_SECRET: str({default: 'super-long-and-random-secret-key-for-my-secure-rust-app-12345'}),
    DB_URL: str({default: 'postgres://user:password@localhost:5432/cronjob_db'}),
    DB_HOST: str({default: 'localhost'}),
    DB_USER: str({default: 'dbadmin'}),
    DB_PASSWORD: str({default: 'dbpassword456'}),
});

module.exports = env;