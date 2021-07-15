var app = getApp();
import { HTTP_REQUEST_URL } from '../../config.js';
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lUserInfo: false
  },
  onLoad: function () {
    this.onSubmit()
  },
  onSubmit: async function () {
    let localUserInfo = wx.getStorageSync('userInfo')
      if (localUserInfo) {
        wx.switchTab({
          url: '../index/index'
        })
      } else {
        console.log('本地无用户信息，请在此获取')
        this.setData({
          lUserInfo: true
        })
      }
  },

  //新增wx.getUserProfile接口
  userProfile:function(e) {
    console.log("我")
    wx.getUserProfile({
      desc: '微信登陆',
      success: res => this.onSaveUserInfo(res.userInfo)
    })
  },
  //保存userInfo到DB
  onSaveUserInfo: function (userInfo) {
    app.globalData.userInfo = userInfo
    console.log(app.globalData.userInfo = userInfo)
    wx.setStorageSync('userInfo', userInfo)
    wx.login({
      success: function (res) {
        var code = res.code; //登录凭证
        wx.setStorageSync('code', res.code)
        if (code) {
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
        }
      }
    })
  },
})