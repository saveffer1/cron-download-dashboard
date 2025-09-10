const helmet = require('helmet');

const helmeted = helmet({
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: null,
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
    },
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    referrerPolicy: { policy: 'no-referrer' },
    strictTransportSecurity: { maxAge: 15552000, includeSubDomains: true },
    xDnsPrefetchControl: { allow: false },
    xPoweredBy: false,
    xXssProtection: true,
})

module.exports = helmeted;