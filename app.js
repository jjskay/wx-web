//app.js
App({
  baseUrl: 'https://win.grand56.com/',
  pageSize: 30,
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    
  },

  getAuthInfo(cb) {
    var vm = this
    if (vm.getToken()) {
      wx.getUserInfo({
        success: function (res) {
          vm.globalData.userInfo = res.userInfo
          typeof cb === 'function' && cb(vm.getToken())
        }
      })
    } else {
      vm.wechartLogin(cb || '')
    }
  },

  getToken() {
    var vm = this
    const tokenObj = wx.getStorageSync('tokenObj') || {}
    const { time, token } = tokenObj
    const oneWeekTime = 60 * 60 * 24 * 7 * 1000
    if (!time || new Date().getTime() - time > oneWeekTime) {
      vm.clearToken()
      return false
    }
    return token
  },

  // 删除token
  clearToken() {
    wx.clearStorage()
  },

  // 打开授权控制面板
  openSetting(cb) {
    const vm = this
    wx.openSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          vm.openSetting(cb)
        } else {
          vm.wechartLogin(cb)
        }
      }
    })
  },

  // 登录
  wechartLogin: function (cb) {
    var vm = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              wx.getUserInfo({
                success: function (res) {
                  vm.globalData.userInfo = res.userInfo
                  vm.login_(cb)
                }
              })
            },
            fail() {
              vm.openSetting(cb)
            }
          })
        } else {
          vm.login_(cb)
        }
      },
      fail() {
        vm.clearToken()
        wx.showModal({
          title: '提示',
          content: '微信授权失败，请重新授权~',
          showCancel: false,
          success: function (res) {
            vm.wechartLogin(cb)
          }
        })
      }
    })
  },

  login_(cb) {
    const vm = this
    wx.login({
      success: res => {
        wx.request({
          method: 'POST',
          url: `${vm.baseUrl}api/v1/user/wapplogin/`,
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            const {Error, UserPem, data} = res.data
            const currentPage = getCurrentPages()[getCurrentPages().length - 1].route
            wx.setStorage({
              key: 'UserPem',
              data: UserPem
            })

            if (UserPem < 600) {
              wx.showModal({
                title: '提示',
                content: Error || '服务器错误',
                showCancel: false
              })
              return
            }

            // 存入token
            if (data && data.Authorization) {
              wx.setStorage({
                key: 'tokenObj',
                data: {
                  time: new Date().getTime(),
                  token: data.Authorization
                }
              })
              typeof cb === 'function' && cb(data.Authorization)
            }

            if (currentPage.indexOf('carSquare') >= 0){
              return
            }

            if (UserPem == 700) {
              wx.showModal({
                title: '提示',
                content: '您已完成入驻~！',
                success: function () {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '/pages/carSquare/index/index'
                    })
                  }
                }
              })
              return
            }

            if (UserPem == 602 && currentPage.indexOf('applyEnter/first') < 0) {
              wx.showModal({
                title: '提示',
                content: '微信登录成功，入驻易卖车使用全部功能！',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/applyEnter/first/index'
                    })
                  // } else if (res.cancel) {
                  //   wx.showToast({
                  //     title: '入驻易卖车才能使用全部功能！',
                  //     icon: 'loading',
                  //     mask: true
                  //   })
                  }
                }
              })
            } else {
              let url = ''
              let msg = ''
              if (UserPem == 603) {
                msg = '已绑定手机号~'
                url = '/pages/applyEnter/second/index'
              }

              if (UserPem == 604) {
                msg = '入驻申请未通过~'
                url = '/pages/applyEnter/result/index'
              }

              if (UserPem == 605) {
                msg = '入驻申请审核中,请稍等~'
                url = '/pages/applyEnter/result/index'
              }

              if (UserPem == 606) {
                msg = 'VIP已到期，请联系客服续费~'
                url = ''
              }

              wx.showModal({
                title: '提示',
                content: msg,
                success(res) {
                  url && res.confirm && wx.redirectTo({
                    url
                  })
                }
              })
            }
          },
          fail: function () {
            vm.clearToken()
            wx.showModal({
              title: '提示',
              content: '微信登录失败，请重试！',
              showCancel: false
            })
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null
  },

  /**
  * ajax中间层拦截处理
  * exception 是否不需要结果拦截，直接返回
  */
  ajax: function (obj) {
    if (!obj) {
      wx.showToast({
        title: '参数有问题',
        icon: 'warn',
        duration: 1000,
        mask: true
      })
      return
    }
    const vm = this
    var header = {}
    var sysInfo = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {}
    const tokenObj = wx.getStorageSync('tokenObj') || {}
    header = Object.assign(obj.header || { "Content-Type": "application/json" }, sysInfo, { 'AUTHORIZATION': tokenObj.token})
    wx.request({
      url: obj.url,
      header: header,
      method: obj.method || 'GET',
      data: obj.data,
      dataType: obj.dataType || 'json',
      success: function (res) {
        var err = ''
        const {data, status, Error, UserPem} = res.data
        const currentUrl = vm.getCurrentPageUrl()

        wx.setStorage({
          key: 'UserPem',
          data: UserPem
        })
        if (UserPem == 601) {
          wx.showModal({
            title: '提示',
            content: '未登录或者登陆失效，请重新登陆~',
            showCancel: true,
            success(res) {
              if (res.confirm) {
                vm.clearToken()
                wx.redirectTo({
                  url: '/pages/carSquare/index/index'
                })
              }
            }
          })
          return
        }

        if (Error || err) {
          wx.showModal({
            title: '提示',
            content: Error || err,
            showCancel: false
          })
          return
        }

        if (currentUrl.indexOf('carSquare') >= 0){
          obj.success(data || true)
          return;
        }

        if (UserPem == 606) {
          wx.showModal({
            title: '提示',
            content: 'VIP已到期，请联系客服续费~',
            showCancel: true
          })
          obj.success(data || true)
          return
        }

        if (UserPem != 700) {
          if (currentUrl.indexOf('user/') > -1 || 
          currentUrl.indexOf('release/') > -1) {
            vm.checkLoginState()
            return
          }
        }

        if (data) {
          if (obj.exception) {
            obj.success(res)
            return
          }

          if (data) {
            obj.success(data || true)
            return
          }

          if (data.code == -1) {
            err = '服务器繁忙，请稍后再试！'
          }
        } else {
          wx.showToast({
            title: '网络有点问题',
            icon: 'loading',
            duration: 1000,
            mask: true
          })
        }
        wx.hideLoading && wx.hideLoading()
      },
      fail: obj.faild || function (res) {
        wx.hideLoading && wx.hideLoading()
        wx.showToast({
          title: '网络有点问题',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
      },
      complete: obj.complete || function (res) {
        wx.hideLoading && wx.hideLoading()
      }
    })
  },

  wxApi: {
    showLoading(config) {
      wx.showLoading && wx.showLoading(config || {})
    },
    hideLoading() {
      wx.hideLoading && wx.hideLoading()
    }
  },

  checkLoginState() {
    const code = wx.getStorageSync('UserPem')
    let msg = ''
    let url = ''
    if (code == 602) {
      msg = '请进行申请入驻成功才能使用该功能~'
      url = '/pages/applyEnter/first/index'
    }

    if (code == 603) {
      msg = '请进行申请入驻成功才能使用该功能~'
      url = '/pages/applyEnter/second/index'
    }

    if (code == 604) {
      msg = '入驻申请未通过~'
      url = '/pages/applyEnter/result/index'
    }

    if (code == 605) {
      msg = '入驻申请审核中,请稍等~'
      url = '/pages/applyEnter/result/index'
    }

    if (code == 606) {
      msg = 'VIP已到期，请联系客服续费~'
      url = ''
    }

    msg && wx.showModal({
      title: '提示',
      content: msg,
      success(res) {
        url && res.confirm && wx.redirectTo({
          url
        })
      }
    })
    return url
  },

  /*获取当前页url*/
  getCurrentPageUrl(){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
  }

})
