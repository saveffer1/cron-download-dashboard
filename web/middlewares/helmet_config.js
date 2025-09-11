const helmet = require('helmet');
const env = require('../utils/config');

const helmetConfig = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
        "'unsafe-inline'"
      ],
      fontSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://fonts.gstatic.com"
      ],
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net"
      ],
      objectSrc: ["'none'"],
      formAction: [
        "'self'",
        `http://${env.APP_HOST}:${env.PORT}`,
        `https://${env.APP_HOST}:${env.PORT}`
      ],
      upgradeInsecureRequests: null 
    },
  },
  hsts: false, // ปิด HSTS
});

module.exports = helmetConfig;
