const debug = require('debug')('telegraf:ratelimit')
const MemoryStore = require('./memory-store.js')

module.exports = function limit (options) {
  const config = Object.assign({
    window: 1000,
    limit: 1,
    keyGenerator: function (ctx) {
      return ctx.from && ctx.from.id
    },
    onLimitExceeded: () => {}
  }, options)
  const store = new MemoryStore(config.window)
  return (ctx, next) => {
    const key = config.keyGenerator(ctx)
    if (!key) {
      return next()
    }
    const hit = store.incr(key)
    debug('key stats', key, hit)
    return hit <= config.limit ? next() : config.onLimitExceeded(ctx, next)
  }
}
