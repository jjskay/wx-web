// pages/user/myIntention/index.js
const app = getApp()
import { getYM, objectUtil, getYear } from '../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loadAll: false,
    isInitData: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const vm = this
    app.wxApi.showLoading({})
    vm.pageNo = 1;
    vm.getList()
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
    this.onPullDownRefresh();
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
    vm.setData({
      loadAll: false,
      isInitData: true
    })
    vm.pageNo = 1;
    vm.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // const vm = this
    // !vm.data.loadAll && vm.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getList() {
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/user/intension/view`,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      // data: {
      //   page: vm.pageNo,
      //   perpage: app.pageSize
      // },
      method: 'GET',
      success: function (res) {
        const listArr = [].concat(res)
        
        vm.setData({
          list: vm.pageNo == 1 ? [].concat(listArr) : vm.data.list.concat(listArr),
          loadAll: res && res.length < 8,
          isInitData: false
        })
        wx.stopPullDownRefresh()
        vm.pageNo++
        app.wxApi.hideLoading()
      }
    })
  },

  /**
   * 删除我的意向
   */
  deleteItem(e) {
    const vm = this
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确定删除这条意向信息吗？',
      cancel: true,
      success: function (res) { 
        const { confirm } = res;
        if (!confirm){
          return;
        }
        app.wxApi.showLoading()

        app.ajax({
          url: `${app.baseUrl}api/v1/user/intension/del/${id}`,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            const {message} = res
            wx.showToast({
              title: message || '服务器繁忙~请稍后再试！',
              duration: 1000,
              mask: true
            })
            vm.pageNo = 1;
            vm.getList();
          }
        })
      }
    })
  },

  addIntention() {
    wx.navigateTo({
      url: '/pages/user/addIntention/index'
    })
  }
})