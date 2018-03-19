// pages/releasse/index.js
const app = getApp()
import { objectUtil, getYMD, getDateYMD } from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      certImgs: [],
      region: [[{ Name: '请选择' }], [{ Name: '请选择' }], [{ Name: '请选择' }]],
      regionIndex: [0,0,0],
      carVal: '请选择',
      startData: '',
      endData: '',
      Mileage: '',
      Price: '',
      InspectionDate: '',
      Commission: '',
      carId: '',
      tabIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const vm = this
    const {id} = options;
    if (id){
      vm.getDetailInfo()
    }
    vm.getBrandList()
  },

  getDetailInfo() {
    const vm = this
    const { id } = vm.options
    app.ajax({
      url: `${app.baseUrl}api/v1/p/view/posts/${id}`,
      method: 'GET',
      success: function (res) {
        const detailInfo = objectUtil.copy(res)
        detailInfo.OnLicenseDate = getDateYMD(detailInfo.OnLicenseDate)
        detailInfo.year = getDateYMD(detailInfo.OnLicenseDate)

        const { 
          Imgs, 
          OnLicenseDate,
          CarBrand, 
          CarModels, 
          CarSeries,
          Mileage,
          Title,
          Price,
          Commission,
          InspectionDate,
          AuditDate
        } = detailInfo
        vm.setData({
          certImgs: Imgs,
          carVal: `${CarBrand.Name}${CarSeries.Name}${CarModels.Name}`,
          startData: OnLicenseDate,
          endData: getDateYMD(AuditDate),
          Mileage,
          Price,
          InspectionDate: getDateYMD(InspectionDate),
          Commission,
          carId: CarModels.id,
          Title
        })
        wx.stopPullDownRefresh()
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
  },

  bindMultiCarPickerChange: function (e) {
    const vm = this
    const { value } = e.detail
    vm.setData({
      carVal: `${vm.data.region[0][value[0]].Name} ${vm.data.region[1][value[1]].Name} ${vm.data.region[2][value[2]].Name}`,
      carId: vm.data.region[2][value[2]].id
    })
  },

  bindMultiCarPickerColumnChange(e) {
    const { column, value } = e.detail
    const vm = this
  
    !column && vm.getSeriesList(vm.data.region[column][value].id)
    1 === column && vm.getCarList(vm.data.region[column][value].id)
  },

  bindStartDateChange(e) {
    const date = e.detail.value
    if (new Date(date).getTime() > new Date().getTime()) {
      wx.showToast({
        title: '上牌时间只能选择今日之前的时间~',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return
    }
    this.setData({
      startData: date
    })
  },

  // 年检保修到期时间
  bindEndDateChange(e){
    const date = e.detail.value
    if (!e.detail.value) {
      wx.showToast({
        title: '请选择保修到期时间~',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return
    }
    this.setData({
      endData: date
    })
  },

  bindInspectionDateChange(e){
    const date = e.detail.value
    this.setData({
      InspectionDate: date
    })
  },

  // 多个输入框填写的内容
  changeText(e) {
    const { type } = e.currentTarget.dataset
    const obj = {}
    obj[type] = e.detail.value
    this.setData(obj)
  },

  getData() {
    const vm = this
    const {
      Price,
      Mileage,
      endData,
      startData,
      carId,
      Commission,
      Title,
      certImgs,
      InspectionDate
    } = vm.data
    let error = ''
    !Price && (error = '请填写价格~')
    !Mileage && (error = '请填写里程数~')
    !InspectionDate && (error = '请选择年检到期时间~')
    !endData && (error = '请选择保修到期时间~')
    !startData && (error = '请选择上牌时间~')
    !carId && (error = '请选择品牌~')
    !certImgs.length && (error = '请上传车况照片~')

    let data = {
      Price,
      Mileage,
      OnLicenseDate: parseInt(new Date(startData) / 1000),
      InspectionDate: parseInt(new Date(InspectionDate) / 1000),
      AuditDate: parseInt(new Date(endData) / 1000),
      CarModel: carId,
      Imgs: []
    }

    Commission && (data.Commission = Commission)
    Title && (data.Title = Title)

    certImgs.map(item => {
      data.Imgs.push(item.uuid || item.id)
    })
    data.Thumb = data.Imgs[0]

    return {
      error,
      data
    }
  },

  // 发布信息
  releaseInfo() {
    const vm = this
    const {id} = vm.options
    const {data, error} = vm.getData()
    if (error){
      wx.showModal({
        title: '提示',
        content: error,
        showCancel: false
      })
      return
    }

    app.wxApi.showLoading()
    if (id){
      app.ajax({
        url: `${app.baseUrl}api/v1/p/posts/edit/${id}`,
        method: 'POST',
        data,
        success: function (res) {
          wx.showToast({
            title: '编辑成功~',
            duration: 1000,
            mask: true
          })

          setTimeout(() => {
            wx.redirectTo({
              url: '../../user/myRelease/index?type=0'
            })
          }, 200)
          app.wxApi.hideLoading()
        }
      })
      return
    }

    app.ajax({
      url: `${app.baseUrl}api/v1/p/add/posts`,
      method: 'POST',
      data,
      success: function (res) {
        wx.showToast({
          title: '发布成功~',
          duration: 1000,
          mask: true
        })

        setTimeout(() => {
          wx.redirectTo({
            url: '../../user/myRelease/index?type=0'
          })
        }, 200)
        app.wxApi.hideLoading()
      }
    })
  },

  redirectTab(e) {
    const { tabIndex } = this.data
    const { index } = e.currentTarget.dataset
    if (tabIndex == index) {
      return
    }
    let url = '/pages/release/index/index'
    1 == index && (url = '/pages/carSquare/index/index')
    2 == index && (url = '/pages/user/myRelease/index')
    3 == index && (url = '/pages/user/index/index')

    if ((!index || 2 == index) && userPromise !== 700) {
      app.checkLoginState(userPromise)
      return
    }

    wx.redirectTo({
      url
    })
  }
})