
// const path = require('path')
// const BaseController = require('./prototype/BaseController')
const ArticleModal = require('../models/article')
const pagination = require('../helpers/page')

// class Article extends BaseController {
//   async GetArticleList (ctx) {
//     const query = ctx.query
//     const searchQuery = {}
//     if (false) {
//       searchQuery.$and = []
//     }
//     if (false) {
//       searchQuery.$or = []
//     }
//     const list = await ArticleModal
//       .find(searchQuery)
//       .sort({ updated_at: -1 })

//     const data = pagination.getCurrentPageDataWithPagination(
//       list.map(item => item.toObject()),
//       query.offset + 1,
//       query.limit
//     )
//     ctx.body = {
//       ...data
//     }
//   }
// }

// 支持筛选、分页
const GetArticleList = async (ctx) => {
  const query = ctx.query
  const searchQuery = {}
  // if (false) {
  //   searchQuery.$and = []
  // }
  // if (false) {
  //   searchQuery.$or = []
  // }
  const list = await ArticleModal
    .find(searchQuery)
    .sort({ updated_at: -1 })

  const data = pagination.getCurrentPageDataWithPagination(
    list.map(item => item.toObject()),
    query.offset + 1,
    query.limit
  )
  ctx.body = {
    ...data
  }
}

const GetArticleById = async (ctx) => {
  const articleId = ctx.params.id
  console.log(articleId)

  const articleDoc = await ArticleModal
    .findByIdAndUpdate(articleId, { $inc: { read_count: 1 } })

  ctx.body = {
    ...articleDoc.toObject()
  }
}

const PostArticle = async (ctx) => {
  let data = ctx.request.body

  if (!data.title || !data.content_md) {
    ctx.body = {
      err: 'require necessary filed'
    }
    ctx.response.status = 422
    return
  }
  var articleModal = new ArticleModal({
    title: data.title,
    content_md: data.content_md
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
