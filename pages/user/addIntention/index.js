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
    carId: '',
    scrollTop: 0,

    showTop: false,
    showCenter: false,
    showLast: false,
    topItem: '',
    centerItem: '',
    lastItem: '',
    selectTopItem: '',
    selectCenterItem: '',
    selectLastItem: '',
    toView: 'A',

    positionList: []
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
      Price,
      carId
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
        KeyWords: vm.data.selectCenterItem.Name,
        Age,
        Mileage,
        Price,
        CarModel: carId
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

  // 选择品牌
  selectBrand() {
    this.setData({
      showTop: true
    })
  },

  closeBrandModal() {
    const obj = {}
    if (this.data.showLast) {
      obj.showLast = false
      this.setData(obj)
      return
    }

    if (this.data.showCenter) {
      obj.showCenter = false
      this.setData(obj)
      return
    }

    if (this.data.showTop) {
      obj.showTop = false
      this.setData(obj)
      return
    }
  },
  // 获取品牌列表
  getBrandList() {
    app.wxApi.showLoading()
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/p/car/brand`,
      method: 'GET',
      success: function (res) {
        vm.data.positionList = ["A"]
        for (let i = 0; i < res.length; i++) {
          !i && (res[i].top = true)
          if (res[i - 1] && res[i].GroupName != res[i - 1].GroupName){
            vm.data.positionList.push(res[i].GroupName)
            res[i].top = true
          }
        }
        vm.data.region[0] = res
        vm.setData({
          region: vm.data.region,
          positionList: vm.data.positionList
        })
        // vm.getSeriesList(res[0].id)
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
        for (let i = 0; i < res.length; i++) {
          !i && (res[i].top = true)
          res[i - 1] && res[i].GroupName != res[i - 1].GroupName && (res[i].top = true)
        }
        vm.data.region[1] = res
        vm.setData({
          region: [].concat(vm.data.region),
          showCenter: true
        })
        // vm.getCarList(res[0].id)
        app.wxApi.hideLoading()
      }
    })
  },
  // bindMultiCarPickerChange: function (e) {
  //   const vm = this
  //   const { value } = e.detail
  //   vm.setData({
  //     carVal: `${vm.data.region[0][value[0]].Name} ${vm.data.region[1][value[1]].Name}`,
  //     carId: vm.data.region[1][value[1]].id
  //   })
  // },

  // bindMultiCarPickerColumnChange(e) {
  //   const { column, value } = e.detail
  //   const vm = this

  //   !column && vm.getSeriesList(vm.data.region[column][value].id)
  // },

  // 多个输入框填写的内容
  changeText(e) {
    const { type } = e.currentTarget.dataset
    const obj = {}
    obj[type] = e.detail.value
    this.setData(obj)
  },

  selectTopItemEvent(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      selectTopItem: this.data.region[0][index],
      showCenter: false,
      showLast: false
    })
    this.getSeriesList(this.data.region[0][index].id)
  },

  selectCenterItemEvent(e) {
    const { index } = e.currentTarget.dataset
    const { selectTopItem, selectCenterItem, region } = this.data
    this.setData({
      topItem: selectTopItem,
      centerItem: selectCenterItem,
      selectCenterItem: this.data.region[1][index],
      showTop: false,
      showCenter: false,
      carVal: `${selectTopItem.Name}${this.data.region[1][index].Name}`,
      carId: region[1][index].id
    })
  },

  scrollIntoView(e) {
    const {val} = e.currentTarget.dataset
    val != this.data.toView && this.setData({
      toView: val
    })
  },

  touchMoveIndex(e){
    const len = this.data.positionList.length || 1
    const { pageY } = e.touches[0]
    const { windowHeight } = wx.getSystemInfoSync()
    const scrollHeight = windowHeight * 0.8

    const mean = parseInt((scrollHeight / len) * 100) * 0.01
    const index = parseInt((pageY - windowHeight * 0.1) / mean)
    this.data.positionList[index] != this.data.toView && this.setData({
      toView: this.data.positionList[index]
    })
  }
})