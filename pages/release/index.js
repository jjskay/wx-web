// pages/releasse/index.js
const app = getApp()
import { objectUtil, getYMD } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      certImgs: [],
      region: [[{ Name: '请选择' }], [{ Name: '请选择' }], [{ Name: '请选择' }]],
      regionIndex: [0,0,0],
      carVal: '请选择'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const vm = this
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
        vm.getCarList(res[0].id)
        app.wxApi.hideLoading()
      }
    })
  },
  // 获取汽车车款列表
  getCarList(seriesid) {
    app.wxApi.showLoading()
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/p/car/models/${seriesid}`,
      method: 'GET',
      success: function (res) {
        vm.data.region.pop()
        vm.data.region.push(res)
        vm.setData({
          region: [].concat(vm.data.region)
        })
        app.wxApi.hideLoading()
      }
    })
  },
  /**
   * 上传图片
   */
  uploadImg(e) {
    const vm = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        app.wxApi.showLoading()
        const tempFilePaths = res.tempFilePaths
        const tokenObj = wx.getStorageSync('tokenObj') || {}
        wx.uploadFile({
          url: `${app.baseUrl}api/v1/p/image/upload`,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'AUTHORIZATION': tokenObj.token
          },
          // formData: {
          //   'user': 'test'
          // },
          success: function (res) {
            const { data } = JSON.parse(res.data)
            const obj = {}
            vm.data.certImgs.push(data)
            obj.certImgs = vm.data.certImgs
            vm.setData(obj)
            app.wxApi.hideLoading()
          }
        })

      }
    })
  },
  /**
   * 删除图片
   */
  deleteItem(e) {
    const vm = this
    const { index } = e.currentTarget.dataset
    let imgs = vm.data.certImgs
    imgs.splice(index, 1)
    const data = {}
    data.certImgs = imgs
    vm.setData(data)
    console.log(123)
  },

  bindMultiPickerChange: function (e) {
    const vm = this
    const { value } = e.detail
    vm.setData({
      carVal: `${vm.data.region[0][value[0]].Name} ${vm.data.region[1][value[1]].Name} ${vm.data.region[2][value[2]].Name}`
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },

  bindMultiPickerColumnChange(e) {
    const { column, value } = e.detail
    const vm = this
  
    !column && vm.getSeriesList(vm.data.region[column][value].id)
    1 === column && vm.getCarList(vm.data.region[column][value].id)
  }
})