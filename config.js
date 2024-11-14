require('dotenv').config();

const config = {
  auth: {
    username: process.env.AUTH_USERNAME || 'bull',
    password: process.env.AUTH_PASSWORD || 'board',
  },
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || '',
    tls: process.env.REDIS_TLS === 'true',
  },
  uiConfig: {
    boardTitle: process.APP_TITLE || 'Bull Board',
    boardLogo: process.env.LOGO_SRC ? {
      path: process.env.LOGO_SRC,
      width: process.env.LOGO_WIDTH || 90,
    } : undefined,
  },
};

module.exports = config;
