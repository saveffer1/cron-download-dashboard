const helmet = require('helmet');

const helmeted = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "https://cdn.jsdelivr.net", // allow Bootstrap & Icons CSS
        "https://fonts.googleapis.com" // ถ้าใช้ Google Fonts
      ],
      fontSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://fonts.gstatic.com" // font ของ icons & google fonts
      ],
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net" // allow Bootstrap JS
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    },
  },
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  referrerPolicy: { policy: 'no-referrer' },
  strictTransportSecurity: { maxAge: 15552000, includeSubDomains: true },
  xDnsPrefetchControl: { allow: false },
  xPoweredBy: false,
  xXssProtection: true,
});

module.exports = helmeted;
