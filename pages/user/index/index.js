// pages/user/index/index.js
var app = getApp()
import { getYM, objectUtil, getYear } from '../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    info: {},
    tabIndex: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const vm = this
    console.log(app.globalData.userInfo)
    vm.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/user/my`,
      method: 'GET',
      success: function (res) {
        const obj = objectUtil.copy(res)
        obj.JoinTime = getYM(obj.JoinTime || 0)
        vm.setData({
          info: obj
        })
      }
    })
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

  getYear,

  /**
   * 查看我提交的意向车型
   */
  viewMyIntentionList() {
    wx.navigateTo({
      url: `../../user/myIntention/index`
    })
  },

  /**
   * 查看我关注的
   */
  viewMyFollowList() {
    wx.navigateTo({
      url: `../../user/myFollow/index`
    })
  },
  /**
   * 查看我发布的列表/在售列表
   */
  viewMyRelease(e) {
    const { type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../../user/myRelease/index?type=${type}`
    })
  },  
  redirectTab(e) {
    const { tabIndex } = this.data
    const { index } = e.currentTarget.dataset
    if (tabIndex == index) {
      return
    }
    let url = '/pages/release/index'
    1 == index && (url = '/pages/carSquare/index/index')
    2 == index && (url = '/pages/user/myRelease/index')
    3 == index && (url = '/pages/user/index/index')

    wx.navigateTo({
      url
    })
  }
})