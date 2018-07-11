<template>
  <div>图书ID为：{{bookid}}</div>
</template>

<script type="text/ecmascript-6">
  import {get} from '@/util'
  export default {
    data () {
      return {
        bookid: ''
      }
    },
    mounted () {
      this.bookid = this.$root.$mp.query.id
      this.getDetail()
    },
    methods: {
      async getDetail () {
        const info = await get('/weapp/bookdetail', {id: this.bookid})
        console.log(info)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">

</style>
