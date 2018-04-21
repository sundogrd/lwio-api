/** 身份认证拦截器，放在controller前面，默认拦截器为需要token
 * @param  {} interceptor
 */
exports.authInterceptor = (ctx, interceptor = {}) => {
  const _defaultInterceptor = {
    validator: (ctx) => {
      debugger
      if (ctx.header.authorization.decoded) {
        return true
      }
      return false
    },
    success: () => {
    },
    fail: () => {
      ctx.body = {
        err: 'you are fobidden to access this api'
      }
      ctx.response.status = 403
    }
  }
  const _interceptor = {
    ..._defaultInterceptor,
    ...interceptor
  }

  let isValid = _interceptor.validator(ctx)
  if (isValid) {
    _interceptor.success()
  } else {
    _interceptor.fail()
  }
  return isValid
}
