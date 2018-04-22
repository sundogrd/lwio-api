
const path = require('path')
const ArticleModal = require('../models/article')
const pagination = require('../helpers/page')

// 支持筛选、分页
const GetArticleList = async (ctx) => {
  const query = ctx.query
  const list = await ArticleModal.find({
    $and: [],
    $or: []
  }).sort({ updated_at: -1 })

  const data = pagination.getCurrentPageDataWithPagination(
    list,
    query.currentPage,
    query.pageSize
  )
  ctx.body = {
    ...data
  }
}

const GetArticleById = async (ctx) => {

}

const PostArticle = async (ctx) => {
  let data = ctx.request.body

  if (!data.title || !data.content) {
    ctx.body = {
      err: 'require necessary filed'
    }
    ctx.response.status = 422
    return
  }
  var articleModal = new ArticleModal({
    title: data.title,
    content: data.content
  })
  await articleModal.save(function (err, articleDoc) {
    if (err) {
      // throw new Error(err.toString())
      ctx.body = {
        err: err.errmsg
      }
      ctx.response.status = 422
    } else {
      ctx.body = {
        ...articleDoc.toObject()
      }
    }
  }).catch((err) => {
    console.log(err.errmsg)
  })
}

module.exports = {
  GetArticleList,
  GetArticleById,
  PostArticle
}
