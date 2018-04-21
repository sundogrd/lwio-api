const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const publicKey = fs.readFileSync(path.join(__dirname, '../../publicKey.pub'))

// 用户登录的时候返回token
// let token = jwt.sign({
//   userInfo: userInfo // 你要保存到token的数据
// }, publicKey, { expiresIn: '7d' })

// export let CheckAuth = (ctx) => {
//   let token = ctx.request.header.authorization
//   try {
//     let decoded = jwt.verify(token.substr(7), publicKey)
//     if (decoded.userInfo) {
//       return {
//         status: 1,
//         result: decoded.userInfo
//       }
//     } else {
//       return {
//         status: 403,
//         result: {
//           errInfo: '没有授权'
//         }
//       }
//     }
//   } catch (err) {
//     return {
//       status: 503,
//       result: {
//         errInfo: '解密错误'
//       }
//     }
//   }
// }
