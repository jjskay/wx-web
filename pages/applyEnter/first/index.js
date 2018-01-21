// login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginCodeText: '发送动态码',
    isDisabled: true,
    getCodeDisabled: true,
    phone: '',
    code: ''
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

  //监听手机号码的输入
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })

    if (this.data.phone.length == 11 &&
      !this.getCodeNumber) {
      this.data.getCodeDisabled && this.setData({
        getCodeDisabled: false
      })
    } else {
      !this.data.getCodeDisabled && this.setData({
        getCodeDisabled: true
      })
    }
    this.checkLoginBtnStatus()
  },

  // 监听验证码的输入
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
    this.checkLoginBtnStatus()
  },

  // 检车登录按钮状态
  checkLoginBtnStatus: function () {
    if (this.data.phone.length == 11 &&
      this.data.code) {
      this.data.isDisabled && this.setData({
        isDisabled: false
      })
    } else {
      !this.data.isDisabled && this.setData({
        isDisabled: true
      })
    }
  },

  // 获取验证码
  getQrCode: function () {
    var vm = this;
    if (vm.data.getCodeDisabled){
      return
    }

    if (!this.getCodeNumber) {
      var token = wx.getStorageSync('tokenObj')
      wx.request({
        method: 'POST',
        url: 'https://win.grand56.com/api/v1/user/getvalid', //仅为示例，并非真实的接口地址
        data: {
          phonenumber: vm.data.phone,
          timestamp: parseInt(new Date().getTime() / 1000)
        },
        header: {
          'content-type': 'application/json',
          'AUTHORIZATION': token.token
        },
        success: function (res) {
          if (res.data.status == -1) {
            wx.showModal({
              title: '提示',
              content: res.data.data.message,
              showCancel: false
            })
            return
          }
          vm.getCodeNumber = 120
          vm.setData({
            loginCodeText: '120秒后获取'
          })
          vm.setId = setInterval(vm.setCodeText, 1000)
        }
      })
    }
  },

  setCodeText: function () {
    if (!this.getCodeNumber) {
      clearInterval(this.setId)
      this.setData({
        loginCodeText: '获取验证码',
        getCodeDisabled: false
      })
    } else {
      this.getCodeNumber--
      this.setData({
        loginCodeText: this.getCodeNumber + '秒后获取'
      })
    }
  },

  redirect() {
    const vm = this
    vm.submitCode();
    wx.navigateTo({
      url: '../second/index'
    })
  },

  submitCode: function () {
    var vm = this
    var token = wx.getStorageSync('tokenObj')
    wx.request({
      method: 'POST',
      url: 'https://win.grand56.com/api/v1/user/validcode', //仅为示例，并非真实的接口地址
      data: {
        code: vm.data.code,
        timestamp: parseInt(new Date().getTime() / 1000)
      },
      header: {
        'content-type': 'application/json',
        'AUTHORIZATION': token.token
      },
      success: function (res) {
        if (res.data.status == -1) {
          wx.showModal({
            title: '提示',
            content: res.data.data.message,
            showCancel: false
          })
          return
        }
        console.log(res)
      }
    })
  }
})