//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var vm = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res && res.data && res.data.token){
          // 登录超时
          if (new Date().getTime() - res.data.time >= 30 * 3600 * 24 * 1000) {
            wx.showModal({
              title: '提示',
              content: '登录失效，请重新授权登录！',
              showCancel: false,
              success: function(){
                wx.removeStorageSync('token')
                vm.authorizeUserInfo()
              }
            })
          }else{
            wx.hideLoading()
          }
        }else{
          wx.hideLoading()
          vm.authorizeUserInfo()
        }
      },
      fail: function() {
        vm.authorizeUserInfo()
      }
    })

  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        },
        fail: function(){
          wx.showModal({
            title: '警告',
            content: '您已经取消授权，请重新授权后才能使用~！。',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      })
    }
  },
  authorizeUserInfo: function() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.hideLoading()
            },
            fail() {
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '您已经取消授权，请重新授权后才能使用~！',
                showCancel: false,
                success: function () {
                  wx.showLoading({
                    title: '请重新打开小程序授权~!',
                    mask: true
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null
  }
})
