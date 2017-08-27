//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    
    // 授权
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
        }else{
          wx.hideLoading()
        }
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
            content: '您点击了拒绝授权，部分功能将无法正常使用。请10分钟后再次点击授权，或者删除小程序重新进入。',
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

  globalData: {
    userInfo: null
  }
})
