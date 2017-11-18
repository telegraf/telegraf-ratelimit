[![Build Status](https://img.shields.io/travis/telegraf/telegraf-ratelimit.svg?branch=master&style=flat-square)](https://travis-ci.org/telegraf/telegraf-ratelimit)
[![NPM Version](https://img.shields.io/npm/v/telegraf-ratelimit.svg?style=flat-square)](https://www.npmjs.com/package/telegraf-ratelimit)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# Telegraf Rate Limit

Rate-limiting middleware for [Telegraf (Telegram bot framework)](https://github.com/telegraf/telegraf).

## Installation

```js
$ npm install telegraf-ratelimit
```

## Example
  
```js
const Telegraf = require('telegraf')
const rateLimit = require('telegraf-ratelimit')

// Set limit to 1 message per 3 seconds
const limitConfig = {
  window: 3000,
  limit: 1,
  onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded')
}
const telegraf = new Telegraf(process.env.BOT_TOKEN)
telegraf.use(rateLimit(limitConfig))
telegraf.on('text', (ctx) => ctx.reply('Hello!'))
telegraf.startPolling()

```

## API

### Options

* `window`: how long to keep records of requests in memory in ms (default: 1 second)
* `limit`: max number of messages during window (default: 1)
* `keyGenerator`: key generator function (context -> any)
* `onLimitExceeded`: rate-limit middleware

Default implementation of `keyGenerator`:

```js
function keyGenerator(ctx) {
  return ctx.from.id
}
```
