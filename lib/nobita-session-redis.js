module.exports = app => {
  if (app.config.redis) {
    const Redis = require('ioredis');
    const redis = new Redis(app.config.redis);
    app.redis = app.context.redis = redis;
  }

  if (app.config.sessionRedis) {
    app.config.session = _.merge({
      store: {
        async get(key, maxAge, { rolling }) {
          try {
            let value = await app.redis.get(key);
            value = JSON.parse(value);
            return value;
          } catch (err) {
            console.error('【error】开启sessionRedis前，请先配置redis，可参考：https://iamtang.github.io/nobita/#/')
          }
        },
        async set(key, sess, maxAge, { rolling, changed }) {
          try {
            sess = JSON.stringify(sess);
            await app.redis.set(key, sess, 'EX', maxAge / 1000);
          } catch (err) {
            console.error('【error】开启sessionRedis前，请先配置redis，可参考：https://iamtang.github.io/nobita/#/')
          }
        },
        async destroy(key) {
          try {
            await app.redis.del(key);
          } catch (err) {
            console.error('【error】请先配置redis，可参考：https://iamtang.github.io/nobita/#/')
          }

        }
      }
    }, app.config.session);
  }
}
