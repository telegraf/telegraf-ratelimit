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
const RateLimit = require('telegraf-ratelimit')

const telegraf = new Telegraf(process.env.BOT_TOKEN)

// Set limit to 1 message per 3 seconds
const limiter = new RateLimit({
  window: 3000,
  limit: 1,
  onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded')
})

telegraf.use(limiter.middleware())
telegraf.on('text', (ctx) => ctx.reply('Hey'))
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

## License

The MIT License (MIT)

Copyright (c) 2016 Vitaly Domnikov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

