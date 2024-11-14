require('dotenv').config();

const config = {
  auth: {
    disable: process.env.AUTH_DISABLE === 'true',
    username: process.env.AUTH_USERNAME || 'bull',
    password: process.env.AUTH_PASSWORD || 'board',
  },
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB || 0,
  },
  uiConfig: {
    boardTitle: process.env.APP_TITLE || 'Bull Board',
    boardLogo: process.env.LOGO_SRC ? {
      path: process.env.LOGO_SRC,
      width: process.env.LOGO_WIDTH || 90,
    } : undefined,
  },
  queueNames: process.env.QUEUE_NAMES ? process.env.QUEUE_NAMES.split(',') : [],
  queueMqNames: process.env.QUEUE_MQ_NAMES ? process.env.QUEUE_MQ_NAMES.split(',') : []
};

module.exports = config;
