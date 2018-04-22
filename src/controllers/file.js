const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

const accessPromise = async (targetDir) => {
  return new Promise((resolve, reject) => {
    fs.access(targetDir, function (err) {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

const Upload = async (ctx) => {
  var form = new formidable.IncomingForm()
  form.uploadDir = '/tmp' // 文件保存在系统临时目录
  form.maxFieldsSize = 20 * 1024 * 1024 // 上传文件大小限制为最大20M
  form.keepExtensions = true // 使用文件的原扩展名
  form.encoding = 'utf-8'

  var targetDir = path.join(__dirname, '../../storeroom')

  // 检查目标目录，不存在则创建
  try {
    await accessPromise(targetDir)
  } catch (e) {
    fs.mkdirSync(targetDir)
  }

  try {
    const parsed = await _fileParse(ctx.req)
  } catch (e) {
    console.log(e)
  }

  ctx.status = 204
  ctx.body = {}
  // 文件解析与保存
  function _fileParse (req) {
    return new Promise((resolve, reject) => {
      form.parse(req, function (err, fields, files) {
        if (err) throw err
        var filesUrl = []
        var keys = Object.keys(files)
        keys.forEach(function (key) {
          var filePath = files[key].path
          var fileExt = filePath.substring(filePath.lastIndexOf('.'))
          // 以当前时间戳对上传文件进行重命名
          var fileName = new Date().getTime() + fileExt
          var targetFile = path.join(targetDir, fileName)
          // 移动文件
          fs.renameSync(filePath, targetFile)
          // 文件的Url（相对路径）
          filesUrl.push('/root/storeroom/' + fileName)
        }
        )
        resolve({
          files,
          filesUrl
        })
      })
    })
  }
}

const GetList = async (ctx) => {
  ctx.body = {
    result: 'post',
    name: ctx.params.name,
    para: ctx.request.body
  }
}

const Delete = (ctx) => {
  ctx.body = {
    result: 'delect',
    name: ctx.params.name,
    para: ctx.request.body
  }
}

module.exports = {
  Upload,
  GetList,
  Delete
}
