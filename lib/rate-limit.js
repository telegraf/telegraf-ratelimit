const debug = require('debug')('telegraf:ratelimit')
const MemoryStore = require('./memory-store.js')

class RateLimit {
  constructor (config) {
    this.config = Object.assign({
      window: 1000,
      limit: 1,
      keyGenerator: function (ctx) {
        return ctx.from.id
      },
      onLimitExceeded: () => undefined
    }, config)
    this.store = new MemoryStore(this.config.window)
  }

  middleware () {
    return (ctx, next) => {
      const key = this.config.keyGenerator(ctx)
      debug('key', key)
      if (!key) {
        return next()
      }
      const hit = this.store.incr(key)
      return hit <= this.config.limit ? next() : this.config.onLimitExceeded(ctx, next)
    }
  }
}

module.exports = RateLimit
