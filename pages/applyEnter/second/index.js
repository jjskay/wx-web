// pages/applyEnter/second/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userCertNum: '',
    shopName: '',
    shopAddress: '',
    certImgs: [],
    shopImgs: []
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const UserPem = wx.getStorageSync('UserPem')
    // 审核已通过
    if (UserPem == 700) {
      wx.showModal({
        title: '提示',
        content: '已成功入驻~',
        showCancel: false,
        success(res) {
          res.confirm && wx.navigateTo({
            url: '/pages/carSquare/index/index'
          })
        }
      })
      return
    }
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
    const vm = this
    const {
      userName,
      // userCertNum,
      shopName,
      shopAddress,
      // certImgs,
      shopImgs
    } = vm.data
    let error = ''

    !shopImgs.length && (error = '请上传店铺照片~')
    !shopAddress && (error = '请填写店铺地址~')
    !shopName && (error = '请填写店铺名称~')
    // certImgs.length < 2 && (error = '请上传身份证正反照片~')
    // !userCertNum && (error = '请填写身份证号码~')
    !userName && (error = '请填写真实姓名~')

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
      url: `${app.baseUrl}api/v1/user/apply`,
      method: 'POST',
      data: {
        ShopName: shopName,
        RealName: userName,
        // IdNumber: userCertNum,
        Address: shopAddress,
        // IdImageA: certImgs[0].uuid,
        // IdImageB: certImgs[1].uuid,
        ShopImage: shopImgs[0].uuid
      },
      success: function (res) {
        const { Error, UserPem } = res.data
        wx.setStorage({
          key: 'UserPem',
          data: UserPem
        })
        app.wxApi.hideLoading()
        if (Error){
          wx.showModal({
            title: '提示',
            content: Error,
            showCancel: false
          })
          return
        }

        wx.navigateTo({
          url: '../result/index'
        })
      }
    })
  },
  /**
   * 编辑input框的内容
   */
  changeInputVal(e) {
    const { type } = e.currentTarget.dataset
    const data = {}
    data[type] = e.detail.value
    this.setData(data)
  },
  /**
   * 上传图片
   */
  uploadImg(e) {
    const { type } = e.currentTarget.dataset
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
            vm.data[type].push(data)
            obj[type] = vm.data[type]
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
    const { type, index } = e.currentTarget.dataset
    let imgs = vm.data[type]
    imgs.splice(index, 1)
    const data = {}
    data[type] = imgs
    vm.setData(data)
  }
})