// pages/carSquare/index/index.js
const app = getApp()
import { getYM, objectUtil, getYear } from '../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loadAll: false,
    search: '',
    isInitData: true,
    tabIndex: 1
  },

  /**
   * 生命周期函数--监听页面加载api/v1/user/fellow/cancelapi/v1/user/fellow/cancelapi/v1/user/fellow/canceluser/usuuuu
   */
  onLoad: function (options) {
    app.wxApi.showLoading({})
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
    const vm = this
    app.getAuthInfo((token) => {
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
      vm.pageNo = 1;
      vm.getList()
    })
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
    if (this.isSend) {
      return
    }

    this.isSend = true
    const vm = this
    vm.setData({
      loadAll: false,
      isInitData: true,
      list: []
    })
    vm.pageNo = 1;
    vm.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const vm = this
    !vm.data.loadAll && !vm.isSend && vm.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getList() {
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/p/posts/listview?page=${vm.pageNo}&perpage=30`,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        page: vm.pageNo,
        perpage: app.pageSize,
        search: vm.data.search
      },
      method: 'GET',
      success: function (res) {
        const {ListView} = res
        const listArr = [].concat(ListView || [])
        listArr.map((item) =>{
          item.year = getYear(item.OnLicenseDate)
        })

        vm.setData({
          list: vm.pageNo == 1 ? [].concat(listArr) : vm.data.list.concat(listArr),
          loadAll: !ListView || ListView.length < 8,
          isInitData: false
        })
        wx.stopPullDownRefresh()
        vm.pageNo++
        app.wxApi.hideLoading()
        vm.isSend = false
      },

      complete() {
        vm.isSend = false
      }
    })
  },

  bindSearchInput(e) {
    this.setData({
      search: e.detail.value
    })
    this.onPullDownRefresh()
  },

  // 清空搜索条件
  clearchSearch() {
    this.setData({
      search: ''
    })

    this.onPullDownRefresh()
  },

  // 跳转至信息详情
  jumpDetailInfo(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../info/index?id=${id}`
    })
  },
  addIntention() {
    wx.navigateTo({
      url: '/pages/user/addIntention/index'
    })
  },

  redirectTab(e) {
    const { tabIndex } = this.data
    const index = Number(e.currentTarget.dataset.index)
    const userPromise = wx.getStorageSync('UserPem')
    if (tabIndex == index) {
      return
    }
    let url = '/pages/release/index/index'
    1 == index && (url = '/pages/carSquare/index/index')
    2 == index && (url = '/pages/user/myRelease/index?type=0')
    3 == index && (url = '/pages/user/index/index')

    if ((!index || 2 == index) && userPromise != 700) {
      app.checkLoginState()
      return
    }

    if (1 == index || 3 == index) {
      wx.redirectTo({
        url
      })
      return
    }

    wx.navigateTo({
      url
    })
  },

  goMyIntention() {
    wx.navigateTo({
      url: '../../user/addIntention/index'
    })
  }
})