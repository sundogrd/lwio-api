'use strict'

const send = require('koa-send')

module.exports = function serve (path, root) {
  // remove / begin
  path = path.replace(/^\/+/, '')

  return async (ctx, next) => {
    if (ctx.method === 'HEAD' || ctx.method === 'GET') {
      let reqPathArray = ctx.path.slice(1).split('/')

      // match path
      if (path.length === 0 || path === reqPathArray[0]) {
        // if not serve the root
        // then remove the filtered folder from path
        if (path.length !== 0) {
          reqPathArray = reqPathArray.slice(1)
        }

        await send(ctx, reqPathArray.join('/') || '/', {root: root})
        return next()
      }
    }
    return next()
  }
}
