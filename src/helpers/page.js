function getCurrentPageData (list, page, size) {
  return list.slice((page - 1) * size, page * size)
}
exports.getCurrentPageData = getCurrentPageData
exports.getCurrentPageDataWithPagination = (list, page, size) => ({
  list: getCurrentPageData(list, page, size),
  total: list.length,
  current: parseInt(page),
  size: parseInt(size)
})
