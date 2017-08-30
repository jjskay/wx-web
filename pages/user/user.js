// user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false
  },

  bindTip: function(){
    wx.showModal({
      title: '警告',
      content: '您点击了拒绝授权，部分功能将无法正常使用。请10分钟后再次点击授权，或者删除小程序重新进入。',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  wechartLogin: function() {
    var vm = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              vm.login_()
            }
          })
        }else{
          vm.login_()
        }
      }
    })
  },

  login_: function() {
    wx.login({
      success: res => {
        wx.request({
          method: 'POST',
          url: 'https://win.grand56.com/api/v1/user/wapplogin/', //仅为示例，并非真实的接口地址
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if (res.data.status == -1){
              wx.showModal({
                title: '提示',
                content: res.data.data.message,
                showCancel: false
              })
              return
            }

            var data = res.data.data
            // 存入token
            if (data && data.Authorization){
              wx.setStorage({
                key: 'token',
                data: {
                  time: new Date().getTime(),
                  token: data.Authorization
                }
              })
            }

            if(res.data.status){
              wx.showModal({
                title: '提示',
                content: '微信登录成功，绑定手机号使用全部功能！',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../login/login'
                    })
                  } else if (res.cancel) {
                    wx.showToast({
                      title: '绑定手机号才能使用全部功能！',
                      icon: 'loading',
                      mask: true
                    })
                  }
                }
              })
            }else{

            }
          },
          fail: function() {
            wx.showModal({
              title: '提示',
              content: '微信登录失败，请重试！',
              showCancel: false
            })
          }
        })
      }
    })
  }
})