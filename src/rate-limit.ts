import { Context, MiddlewareFn } from 'telegraf'
import d from 'debug'
import { MemoryStore } from './memory-store'

const debug = d('telegraf:ratelimit')

export interface RateLimitOptions<C extends Context> {
  /** How long to keep records of requests in memory in ms (default: 1 second) */
  window: number
  /** Max number of messages during window (default: 1) */
  limit: number
  /** Key generator function */
  keyGenerator?: (ctx: C) => Promise<string | undefined>
  /** Rate-limit middleware */
  onLimitExceeded?: MiddlewareFn<C>
}

export function rateLimit<C extends Context = Context>(
  options: RateLimitOptions<C>
): MiddlewareFn<C> {
  const config = Object.assign(
    {
      window: 1000,
      limit: 1,
      keyGenerator: function (ctx: C) {
        const fromId = ctx.from?.id
        const chatId = ctx.chat?.id
        if (fromId == null || chatId == null) {
          return undefined
        }
        return `${fromId}:${chatId}`
      },
    },
    options
  )
  const store = new MemoryStore(config.window)
  return (ctx, next) => {
    const key = config.keyGenerator(ctx)
    if (!key) {
      return next()
    }
    const hit = store.incr(key)
    debug('key stats', key, hit)
    if (hit <= config.limit) {
      return next()
    }
    if (config.onLimitExceeded) {
      config.onLimitExceeded(ctx, next)
    }
  }
}
