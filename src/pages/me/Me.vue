<template>
  <div class="contaniner">
    <div class="userinfo">
      <img :src="userinfo.avatarUrl" alt="">
      <p>{{userinfo.nickName}}</p>
    </div>
    <year-progress></year-progress>
    <button v-if='userinfo.openId' @click='scanBook' class="btn">添加图书</button>
    <button v-else open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="login">点击登录</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import qcloud from 'wafer2-client-sdk'
  import YearProgress from '@/components/YearProgress'
  import config from '@/config'
  import {showSuccess, post, showModal} from '@/util'
  export default {
    data () {
      return {
        userinfo: {
          avatarUrl: 'http://image.shengxinjing.cn/rate/unlogin.png',
          nickName: ''
        }
      }
    },
    methods: {
      async addBook (isbn) {
        const res = await post('/weapp/addBook', {
          isbn,
          openid: this.userinfo.openId
        })
        if (res.code === 0 && res.data.title) {
          showModal('添加成功', `${res.title}添加成功`)
        }
      },
      scanBook () {
        wx.scanCode({
          success: (res) => {
            if (res.result) {
              this.addBook(res.result)
            }
          }
        })
      },
      login (e) {
        const self = this
        // 查看是否授权
        wx.getSetting({
          success: (res) => {
            // 授权信息里有用户信息
            if (res.authSetting['scope.userInfo']) {
              // 检查用户登录信息是否过期
              wx.checkSession({
                success: () => {
                  // 没过期，直接登录
                  showSuccess('登录成功')
                },
                fail: () => {
                  // 过期了 重新登录 先清除登录的状态
                  qcloud.clearSession()
                  // 登录状态已过期，需要重新登录
                  // 登录需要的加密信息
                  var option = {
                    encryptedData: e.mp.detail.encryptedData,
                    iv: e.mp.detail.iv,
                    userinfo: e.mp.detail.userInfo
                  }
                  self.getWxLogin(option)
                }
              })
            } else {
              showModal('用户未授权', e.mp.detail.errMsg)
            }
          }
        })
      },
      getWxLogin ({encryptedData, iv, userinfo}) {
        const self = this
        wx.login({
          success: (loginResult) => {
            console.log('loginResult', loginResult)
            var loginParams = {
              code: loginResult.code,
              encryptedData: encryptedData,
              iv: iv
            }
            qcloud.setLoginUrl(config.loginUrl)
            qcloud.requestLogin({
              loginParams,
              success: () => {
                // 获取用户信息
                qcloud.request({
                  url: config.userUrl,
                  login: true,
                  success (userRes) {
                    showSuccess('登陆成功')
                    wx.setStorageSync('userinfo', userRes.data.data)
                    self.userinfo = userRes.data.data
                  },
                  fail (error) {
                    showModal('登录失败', error)
                  }
                })
              },
              fail (loginError) {
                showModal('登录失败', loginError)
              }
            })
          }
        })
      }
    },
    components: {
      YearProgress
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .contaniner
    padding: 0 30rpx
    .userinfo
      margin-top: 100rpx
      text-align: center
      img
        width: 100rpx
        height: 100rpx
        margin: 20rpx
        border-radius: 50%
    .btn
      color: white
      background-color: #EA5A49
      margin-bottom: 10px
      padding-left: 15px
      border-radius: 2px
      font-size: 16px
      line-height: 40px
      height: 40px
      width: 100%
      &:active
        background-color: #FA5A49
</style>
