const Telegraf = require('telegraf')
const rateLimit = require('../lib/rate-limit')

// Set limit to 1 message per 3 seconds per chat per user
const config = {
  window: 3000,
  limit: 1,
  onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded')
}

// Set limit to 1 sticker per 1 minute per chat
const stickerLimitConfig = {
  window: 60 * 1000,
  limit: 1,
  keyGenerator: function (ctx) {
    return ctx.chat.id
  },
  onLimitExceeded: (ctx, next) => ctx.reply('Sticker rate limit exceeded')
}

const telegraf = new Telegraf(process.env.BOT_TOKEN)
telegraf.use(rateLimit(config))
telegraf.on('sticker', rateLimit(stickerLimitConfig), (ctx) => ctx.reply('Nice sticker'))
telegraf.on('text', (ctx) => ctx.reply('Hey'))
telegraf.startPolling()
