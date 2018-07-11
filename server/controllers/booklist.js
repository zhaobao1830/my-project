
const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
    const {page} = ctx.request.query
    const size = 10
    const books = await mysql('books')
        .select('books.*', 'cSessionInfo.user_info')
        .join('cSessionInfo', 'books.openid', 'cSessionInfo.open_id')
        .orderBy('books.id', 'desc')
        .limit(size)
        .offset(Number(page) * 10 + 1)
    ctx.state.data = {
        list: books
    }
}
