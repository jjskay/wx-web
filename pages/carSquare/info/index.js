// pages/carSquare/info/index.js
const app = getApp()
import { objectUtil, getYMD, getYear } from '../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {
      CarBrand: {},
      CarSeries: {}
    },
    list: [],
    countInfo: [],
    status:'-',
    hiddenmodalput: true,
    newPrice: ''
  },

  hideModal() {
    this.setData({
      hiddenmodalput: true
    })
  },

  updatePrice() {
    this.setData({
      hiddenmodalput: false
    })
  },

  priceChange(e) {
    this.setData({
      newPrice: e.detail.value
    })
  },

  confirmUpdate(e) {
    const vm = this
    if (!(this.data.newPrice > 0) || this.data.newPrice == this.data.detail.Price){
      wx.showToast({
        title: '请输入新价格~',
        icon: 'none'
      })
      return
    }
    // wx.showModal({
    //   title: '提示',
    //   content: '确定修改价格吗？',
    //   success(res) {
    //     if (!res.confirm){
    //       return;
    //     }
    //     vm.updateApi('price', { price: vm.data.newPrice })
    //   }
    // })
    vm.updateApi('price', { price: vm.data.newPrice })
  },

  updateApi(t, data) {
    app.wxApi.showLoading()
    const vm = this
    app.ajax({
      url: `${app.baseUrl}api/v1/p/post/update/${vm.options.id}?action=${t}`,
      method: 'POST',
      data,
      success: function (res) {
        vm.hideModal();
        wx.showModal({
          title: '提示',
          content: '修改成功~',
          showCancel: false,
          success() {
            vm.getDetailInfo()
          }
        })
        app.wxApi.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.id) {
      wx.showModal({
        title: '提示',
        content: '参数有误~',
        cancel: false,
        success: function (res) { }
      })
      return
    }

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
    const { id } = this.options
    const vm = this
    if (!id) {
      wx.showModal({
        title: '提示',
        content: '参数有误~',
        cancel: false,
        success: function (res) { }
      })
      return
    }

    app.getAuthInfo(() => {
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
      setTimeout(vm.getDetailInfo, 200)
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
    const vm = this
    vm.getDetailInfo()
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
    return {
      title: (this.data.detail.CarBrand.Name || '') + (this.data.detail.CarSeries.Name || '') + (this.data.detail.Title || '')
    }
  },

  // 获取信息详情
  getDetailInfo() {
    const vm = this
    const {id} = vm.options
    app.ajax({
      url: `${app.baseUrl}api/v1/p/view/posts/${id}`,
      method: 'GET',
      success: function (res) {
        vm.detailInfo = res;
        const detailInfo = objectUtil.copy(res)
        detailInfo.OnLicenseDate = getYMD(detailInfo.OnLicenseDate)
        detailInfo.year = getYMD(detailInfo.OnLicenseDate)
        detailInfo.checkDate = getYMD(detailInfo.InspectionDate)
        detailInfo.endTime = getYMD(detailInfo.AuditDate)
        vm.setData({
          detail: detailInfo,
          newPrice: res.Price,
          status: res.SaleStatus == 1 ? '在售' : '已售'
        })
        wx.stopPullDownRefresh()
        app.wxApi.hideLoading()

        if (res.ExtInfo.Editble){
          vm.getCountInfo()
        }
      }
    })

    vm.getList()
  },
  // 获取统计信息
  getCountInfo() {
    const vm = this
    const { id } = vm.options
    app.ajax({
      url: `${app.baseUrl}api/v1/s/statistics/${id}`,
      method: 'GET',
      success: function (res) {
        vm.setData({
          countInfo: res
        })
        wx.stopPullDownRefresh()
        app.wxApi.hideLoading()
      }
    })
  },
  
  // 获取推荐列表
  getList() {
    const vm = this
    const { id } = vm.options
    app.ajax({
      url: `${app.baseUrl}api/v1/p/post/recommend/${id}`,
      method: 'GET',
      success: function (res) {
        const listArr = [].concat(res.ListView || [])
        listArr.map((item) => {
          item.year = getYear(item.OnLicenseDate)
        })
        vm.setData({
          list: listArr
        })
        wx.stopPullDownRefresh()
        app.wxApi.hideLoading()
      }
    })
  },

  changeInfoStatus() {
    const vm = this
    if (vm.data.detail.SaleStatus == 2){
      return;
    }
    wx.showActionSheet({
      itemList: ['已售'],
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '确认修改吗？',
          success(rs) {
            if (!rs.confirm){
              return
            }
            vm.updateApi('sold', {})
          }
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  //显示分享面板
  shareInfo() {
    const vm = this
    wx.showActionSheet({
      itemList: ['转发', '生成图片分享'],
      success: function (res) {
        if (!(res.tapIndex >= 0)) {
          return
        }

        if (!res.tapIndex){
          wx.showModal({
            title: '提示',
            content: '请点击页面右上角按钮转发~',
            showCancel: false
          })
        } else{
          const tokenObj = wx.getStorageSync('tokenObj') || {}
          app.wxApi.showLoading()
          wx.downloadFile({
            url: `${app.baseUrl}api/v1/p/sharepic/${vm.options.id}?series=0`,
            header: {
              'AUTHORIZATION': tokenObj.token
            },
            success(res){
              app.wxApi.hideLoading()
              if (res.statusCode === 200) {
                wx.saveFile({
                  tempFilePath: res.tempFilePath,
                  success: function (rs) {
                    const path = rs.savedFilePath
                    wx.showModal({
                      title: '提示',
                      content: '图片下载完毕，长按分享吧~',
                      showCancel: false,
                      success() {
                        wx.previewImage({
                          current: '', // 当前显示图片的http链接
                          urls: [path] // 需要预览的图片http链接列表
                        })
                      }
                    })
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '分享图片下载失败~',
                  showCancel: false
                })
              }
            },

            fail(res){
              app.wxApi.hideLoading()
              wx.showModal({
                title: '提示',
                content: '分享图片下载失败~',
                showCancel: false
              })
            }
          })
        }
      },
      fail: function (res) {
        app.wxApi.hideLoading()
        console.log(res.errMsg)
      }
    })
  },

  getYMD,
  /**
   * 关注
   */
  addFollow() {
    const vm = this
    const { PhoneNum } = vm.data.detail.ExtInfo || {}
    const userPromise = wx.getStorageSync('UserPem')
    if (userPromise != 700) {
      app.checkLoginState()
      return
    }
    app.wxApi.showLoading({
      mask: true
    })
    app.ajax({
      url: `${app.baseUrl}api/v1/user/fellow/add`,
      header: {
        'content-type': 'application/json'
      },
      data: JSON.stringify({
        post: vm.options.id
      }),
      method: 'POST',
      success: function (res) {
        let content = '服务器异常，请重试~'
        if (res.message == 'ok'){
          content = '关注成功~'
        }
        wx.showModal({
          title: '提示',
          content,
          showCancel: false
        })
        app.wxApi.hideLoading()
        vm.onPullDownRefresh()
      }
    })
  },

  followAction() {
    const vm = this
    if (vm.data.detail.ExtInfo.Following && !vm.data.detail.ExtInfo.Editble){
      vm.unFollowAction()
    } else {
      vm.addFollow()
    }
  },

  /**
   * 取消关注
   */
  unFollowAction() {
    const vm = this
    const { PhoneNum } = vm.data.detail.ExtInfo || {}
    const userPromise = wx.getStorageSync('UserPem')
    if (userPromise != 700) {
      app.checkLoginState()
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定取消关注此信息吗？',
      cancel: true,
      success: function (res) {
        const { confirm } = res;
        if (!confirm) {
          return;
        }
        app.wxApi.showLoading()

        app.ajax({
          url: `${app.baseUrl}api/v1/user/fellow/cancel`,
          header: {
            'content-type': 'application/json'
          },
          data: JSON.stringify({
            UserId: vm.data.detail.ExtInfo.UserId
          }),
          method: 'POST',
          success: function (res) {
            let content = '服务器异常，请重试~'
            if (res.message == 'ok') {
              content = '取消关注成功~'
            }
            wx.showModal({
              title: '提示',
              content,
              showCancel: false
            })
            app.wxApi.hideLoading()
            vm.onPullDownRefresh()
          }
        })
      }
    })
  },
  
  // 预约看车
  callPhoneNumber() {
    const { PhoneNum } = this.data.detail.ExtInfo || {}
    wx.makePhoneCall({
      phoneNumber: PhoneNum || '' //仅为示例，并非真实的电话号码
    })
  },

  editInfo() {
    const {id} = this.options
    if (app.checkLoginState()) {
      return
    }
    wx.navigateTo({
      url: `/pages/release/index/index?id=${id}`
    })
  },

  deleteInfo() {
    const { id } = this.options
    if (app.checkLoginState()){
      return
    }
    wx.showModal({
      title: '删除',
      content: '你确定要删除此条信息吗？',
      success(res) {
        if (!res.confirm){
          return
        }
        app.wxApi.showLoading()
        app.ajax({
          url: `${app.baseUrl}api/v1/p/post/update/${id}?action=delete`,
          method: 'POST',
          success: function (res) {
            wx.showToast({
              title: '删除成功~',
              duration: 1000,
              mask: true
            })

            setTimeout(() => {
              wx.navigateBack();
              // wx.redirectTo({
              //   url: '../../user/myRelease/index?type=0'
              // })
            }, 200)
            app.wxApi.hideLoading()
          }
        })
      }
    })
  },
  jumpDetailInfo(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../info/index?id=${id}`
    })
  },

  viewPic(e) {
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  }
})