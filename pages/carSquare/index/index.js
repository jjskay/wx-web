// pages/carSquare/index/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loadAll: false,
    search: '',
    isInitData: true
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
    const vm = this
    app.wxApi.showLoading({})
    app.getAuthInfo(() =>{
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
      vm.pageNo = 1;
      vm.getList()
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
    const vm = this
    !vm.data.loadAll && vm.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getList() {
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/p/posts/listview?page=1&perpage=30`,
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
        
        vm.setData({
          list: vm.pageNo == 1 ? [].concat(ListView) : vm.data.list.concat(ListView),
          loadAll: ListView && ListView.length < 8,
          isInitData: false
        })
        wx.stopPullDownRefresh()
        vm.pageNo++
        app.wxApi.hideLoading()
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
  }
})