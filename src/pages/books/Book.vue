<template>
  <div>
    <card :key="book.id" v-for="(book, index) in books" :book='book'>{{book.title}}</card>
  </div>
</template>
<script>
  import {get} from '@/util'
  import Card from '@/components/Card'
  export default {
    data () {
      return {
        books: [],
        page: 0,
        more: true
      }
    },
    mounted () {
      this.getList(true)
    },
    methods: {
      async getList (init) {
        if (init) {
          this.page = 0
          this.more = true
        }
        wx.showNavigationBarLoading()
        const books = await get('/weapp/booklist', {page: this.page})
        if (books.list.length < 10 && this.page > 0) {
          this.more = false
        }
        if (init) {
          this.books = books.list
          wx.stopPullDownRefresh()
        } else {
          this.books = this.books.concat(books.list)
        }
        wx.hideNavigationBarLoading()
      }
    },
    // 下拉刷新
    onPullDownRefresh () {
      this.getList(true)
    },
    onReachBottom () {
      if (!this.more) {
        // 没有更多了
        return false
      }
      this.page = this.page + 1
      this.getList()
    },
    components: {
      Card
    }
  }
</script>

<style>

</style>
