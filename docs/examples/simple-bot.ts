import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters';
import { rateLimit } from '../../src/rate-limit';

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

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError("BOT_TOKEN must be provided!");
}

const telegraf = new Telegraf(process.env.BOT_TOKEN)
telegraf.use(rateLimit(config))
telegraf.on(message('sticker'), rateLimit(stickerLimitConfig), (ctx) => ctx.reply('Nice sticker'))
telegraf.on(message('text'), (ctx) => ctx.reply('Hey'))
telegraf.launch()
