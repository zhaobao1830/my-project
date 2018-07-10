
const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
    const books = await mysql('books').select('books.*')
    console.log('books', books)
    ctx.state.data = {
        list: books
    }
}
