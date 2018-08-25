module.exports = function () {
  return function (ctx, next) {
    return next().catch((err) => {
      console.log(err)
      if (err.status) {
        switch (err.status) {
          case 401:
            ctx.status = 200
            ctx.body = {
              status: 401,
              result: {
                err: 'Authentication Error',
                errInfo: 'Protected resource, use Authorization header to get access.'
              }
            }
            break
          default:
            throw err
        }
        return
      }
      ctx.status = 400
      ctx.body = {
        err: err.message
      }
    })
  }
}
