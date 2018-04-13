// pages/applyEnter/result/index.js
import { dataFormat } from '../../../utils/util.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    phone: '',
    // idCert: '',
    // certImgs: [],
    isPass: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/user/apply`,
      method: 'GET',
      exception: true,
      success: function (res) {
        const { statusCode} = res
        const { data, status, Error } = res.data
        const { RealName, IdNumber, IdImageA, IdImageB, PhoneNumber, JoinTime } = data
        vm.setData({
          userName: RealName,
          phone: PhoneNumber || 'XXX',
          // idCert: IdNumber,
          // certImgs: [IdImageA, IdImageB],
          isPass: statusCode === 301,
          time: dataFormat(JoinTime)
        })
        app.wxApi.hideLoading()
      }
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

  redirect() {
    wx.navigateTo({
      url: '/pages/release/index'
    })
  }
})