<template>
  <div>
    <div :key="book.id" v-for="(book, index) in books.list">{{book.title}}</div>
  </div>
</template>
<script>
  import {get} from '@/util'
  export default {
    data () {
      return {
        books: [],
        page: 0
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      async getList () {
        const books = await get('/weapp/booklist')
        this.books = books
        console.log(books)
      }
    }
  }
</script>

<style>

</style>
