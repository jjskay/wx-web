// pages/user/addIntention/index.js
const app = getApp()
import { objectUtil, getYMD } from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [[{ Name: '请选择' }], [{ Name: '请选择' }]],
    regionIndex: [0, 0],
    carId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const vm = this
    const {id, cartName} = options
    vm.setData({
      carId: id,
      region: [[{ Name: '请选择' }], [{ Name: cartName }]]
    })
    vm.getBrandList()
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

  // 添加意向车型
  addIntention() {
    const vm = this
    const {
      region,
      regionIndex,
      Age,
      Mileage,
      Price
    } = vm.data
    let error = ''
    if (!Price){
      error = '请填写价格范围~'
    }

    if (!Mileage) {
      error = '请填写行驶里程~'
    }

    if (!Age) {
      error = '请填写车龄~'
    }

    if (!region[1][regionIndex[1]].Name) {
      error = '请选择品牌~'
    }

    if (error){
      wx.showModal({
        title: '提示',
        content: error,
        showCancel: false
      })
      return
    }
    app.wxApi.showLoading()
    app.ajax({
      url: `${app.baseUrl}api/v1/user/intension/add`,
      method: 'POST',
      data: {
        KeyWords: region[1][regionIndex[1]].Name,
        Age,
        Mileage,
        Price
      },
      success: function (res) {
        wx.showToast({
          title: '添加成功~',
          duration: 1000,
          mask: true
        })
        wx.redirectTo({
          url: `../myIntention/index`
        })
        app.wxApi.hideLoading()
      }
    })
  },
  // 获取品牌列表
  getBrandList() {
    app.wxApi.showLoading()
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/p/car/brand`,
      method: 'GET',
      success: function (res) {
        vm.data.region[0] = res
        vm.setData({
          region: vm.data.region
        })
        vm.getSeriesList(res[0].id)
        app.wxApi.hideLoading()
      }
    })
  },
  // 获取汽车系列列表
  getSeriesList(brandid) {
    app.wxApi.showLoading()
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/p/car/series/${brandid}`,
      method: 'GET',
      success: function (res) {
        vm.data.region[1] = res
        vm.setData({
          region: [].concat(vm.data.region)
        })
        // vm.getCarList(res[0].id)
        app.wxApi.hideLoading()
      }
    })
  },
  bindMultiCarPickerChange: function (e) {
    const vm = this
    const { value } = e.detail
    vm.setData({
      carVal: `${vm.data.region[0][value[0]].Name} ${vm.data.region[1][value[1]].Name}`,
      carId: vm.data.region[1][value[1]].id
    })
  },

  bindMultiCarPickerColumnChange(e) {
    const { column, value } = e.detail
    const vm = this

    !column && vm.getSeriesList(vm.data.region[column][value].id)
  },

  // 多个输入框填写的内容
  changeText(e) {
    const { type } = e.currentTarget.dataset
    const obj = {}
    obj[type] = e.detail.value
    this.setData(obj)
  }
})