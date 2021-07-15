var app = getApp();
import { HTTP_REQUEST_URL } from '../../config.js';
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: true
  },
  onLoad: function () {
    var _this = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 3. 已经授权直接进行登录
          _this.bindGetUserInfo();
        } else {
          _this.setData({
            show: false
          })
        }
      }
    })
  },

  bindGetUserInfo: function (event) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: function (res) {
              var code = res.code; //登录凭证
              wx.setStorageSync('code', res.code)
              if (code) {
                //2、调用获取用户信息接口
                wx.getUserInfo({
                  success: function (res) {
                    app.globalData.userInfo = res.userInfo;
                    wx.setStorageSync('userInfo', res.userInfo)
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    wx.request({
                      url: HTTP_REQUEST_URL + 'shanghutong-system/miniProgram/getSession', //服务接口地址
                      method: 'POST',
                      header: {
                        'content-type': 'application/json'
                      },
                      data: {
                        code: code
                      },
                      success: function (data) {
                        app.globalData.openid = data.data.openid;
                        //4.解密成功后 获取自己服务器返回的结果
                        wx.switchTab({
                          url: '../index/index'
                        })
                      },
                      fail: function () {
                        console.log('系统错误')
                      }
                    })
                  },
                  fail: function () {
                    console.log('获取用户信息失败')
                  }
                })

              } else {
                console.log('获取用户登录态失败！' + r.errMsg)
              }
            },
            fail: function () {
              console.log('登陆失败')
            }
          })

        } else {
          console.log('获取用户信息失败')
        }
      }
    })
  }
})