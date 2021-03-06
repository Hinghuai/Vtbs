const Koa = require('koa')
const Router = require('koa-router')

const LRU = require('lru-cache')

const cache = new LRU({
  maxAge: 1000 * 5,
  max: 100,
})

module.exports = ({ vtbs, info, fullGuard, monster }) => {
  const app = new Koa()

  app.use(async (ctx, next) => {
    let hit = cache.get(ctx.url)
    if (hit) {
      ctx.body = hit
    } else {
      await next()
      cache.set(ctx.url, ctx.body)
    }
  })

  const v1 = new Router({ prefix: '/v1' })

  v1.get('/vtbs', ctx => {
    ctx.body = vtbs
  })

  v1.get('/info', async ctx => {
    ctx.body = (await Promise.all(vtbs.map(({ mid }) => info.get(mid)))).filter(info => info)
  })

  v1.get('/detail/:mid', async ctx => {
    let result = await info.get(ctx.params.mid)
    if (result) {
      ctx.body = result
    }
  })

  v1.get('/guard/:target', async ctx => {
    let result = await fullGuard.get(ctx.params.target)
    if (result) {
      ctx.body = result
    }
  })

  app.use(v1.routes())

  const vd = new Router({ prefix: '/vd' })

  vd.get('/rooms', async ctx => {
    let result = await monster.rooms()
    ctx.body = result
  })

  vd.get('/records/:roomid', async ctx => {
    let result = await monster.records(ctx.params.roomid)
    ctx.body = result
  })

  vd.get('/rr', async ctx => {
    let result = await monster.roomsRecords()
    ctx.body = result
  })

  vd.get('/read/:roomid/:date', async ctx => {
    let result = await monster.read(ctx.params.roomid, ctx.params.date)
    ctx.body = result
  })

  app.use(vd.routes())

  return app.callback()
}
