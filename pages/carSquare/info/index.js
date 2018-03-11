// pages/carSquare/info/index.js
const app = getApp()
import { objectUtil, getYMD } from '../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id} = options
    const vm = this
    if (!id){
      wx.showModal({
        title: '提示',
        content: '参数有误~',
        cancel: false,
        success: function (res) { }
      })
      return
    }

    app.wxApi.showLoading({})
    app.getAuthInfo(() => {
      const token = app.getToken()
      if (!token) {
        wx.showModal({
          title: '提示',
          content: '微信授权失败，请重新授权~',
          cancel: false,
          success: function (res) { }
        })
        app.wxApi.hideLoading()
        return
      }
      vm.getDetailInfo()
    })
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
    const vm = this
    vm.getDetailInfo()
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

  // 获取信息详情
  getDetailInfo() {
    const vm = this
    const {id} = vm.options
    app.ajax({
      url: `${app.baseUrl}api/v1/p/view/posts/${id}`,
      method: 'GET',
      success: function (res) {
        const detailInfo = objectUtil.copy(res)
        detailInfo.OnLicenseDate = getYMD(detailInfo.OnLicenseDate)
        detailInfo.year = getYMD(detailInfo.OnLicenseDate)
        vm.setData({
          detail: detailInfo
        })
        wx.stopPullDownRefresh()
        app.wxApi.hideLoading()
      }
    })
  },

  getYMD,
  /**
   * 关注
   */
  followAction() {
    const vm = this
    const { PhoneNum } = vm.data.detail.ExtInfo || {}
    const userPromise = wx.getStorageSync('UserPem')
    if (userPromise != 700) {
      app.checkLoginState()
      return
    }
    app.ajax({
      url: `${app.baseUrl}api/v1/user/fellow/add`,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        UserPhoneNum: PhoneNum
      },
      method: 'POST',
      success: function (res) {
        const { message } = res
        message && wx.showToast({
          title: message || '服务器繁忙~请稍后再试！',
          duration: 1000,
          mask: true
        })
        app.wxApi.hideLoading()
        vm.onPullDownRefresh()
      }
    })
  },

  /**
   * 取消关注
   */
  unFollowAction() {
    const vm = this
    const { PhoneNum } = vm.data.detail.ExtInfo || {}
    const userPromise = wx.getStorageSync('UserPem')
    if (userPromise != 700) {
      app.checkLoginState()
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定取消关注此信息吗？',
      cancel: true,
      success: function (res) {
        const { confirm } = res;
        if (!confirm) {
          return;
        }
        app.wxApi.showLoading()

        app.ajax({
          url: `${app.baseUrl}api/v1/fellow/cancel`,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            UserNum: PhoneNum
          },
          method: 'POST',
          success: function (res) {
            const { message } = res
            wx.showToast({
              title: message || '服务器繁忙~请稍后再试！',
              duration: 1000,
              mask: true
            })
            app.wxApi.hideLoading()
            this.onPullDownRefresh()
          }
        })

      }
    })
  },
  
  // 预约看车
  callPhoneNumber() {
    const { PhoneNum } = this.data.detail.ExtInfo || {}
    wx.makePhoneCall({
      phoneNumber: PhoneNum || '' //仅为示例，并非真实的电话号码
    })
  }
})