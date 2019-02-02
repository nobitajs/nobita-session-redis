module.exports = app => {
  if (app.config.redis) {
    const sessionRedis = require('./lib/nobita-session-redis');
    sessionRedis(app);
  }
}
