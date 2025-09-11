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
        "https://cdn.jsdelivr.net",
        "'unsafe-inline'", // Allowed for dynamically loaded scripts
        "'unsafe-eval'" // Required for Alpine.js
      ],
      objectSrc: ["'none'"],
              formAction: ["*"], // Allow all form actions for development (less secure)
      upgradeInsecureRequests: null 
    },
  },
  hsts: false, // ปิด HSTS
});

module.exports = helmetConfig;
