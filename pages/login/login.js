// login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginCodeText: '获取验证码',
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
  bindPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
    
    if (this.data.phone.length == 11 && 
      !this.getCodeNumber){
      this.data.getCodeDisabled && this.setData({
        getCodeDisabled: false
      })
    }else{
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
  checkLoginBtnStatus: function() {
    if (this.data.phone.length == 11 && 
      this.data.code){
      this.data.isDisabled && this.setData({
        isDisabled: false
      })
    }else{
      !this.data.isDisabled && this.setData({
        isDisabled: true
      })
    }
  },

  // 获取验证码
  getQrCode: function() {
    var vm = this;
    if (!this.getCodeNumber){
      this.getCodeNumber = 120
      this.setData({
        loginCodeText: '120秒后获取'
      })
      this.setId = setInterval(vm.setCodeText, 1000)
    }
  },

  setCodeText: function() {
    if (!this.getCodeNumber){
      clearInterval(this.setId)
      this.setData({
        loginCodeText: '获取验证码',
        getCodeDisabled: false
      })
    }else{
      this.getCodeNumber--
      this.setData({
        loginCodeText: this.getCodeNumber + '秒后获取'
      })
    }
  }
})