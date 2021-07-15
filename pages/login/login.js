import {getSession,getDecrypt,isRegister,goRegister} from '../../api/register';
import { goSignin } from '../../api/login';
var app = getApp();
Page({
  data: {
    phone: '',
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    openId: "",
    sessionKey: "",
    pageRoute: 0
  },
  onLoad: function () {
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    console.log(prevpage.route)
		if ( prevpage.route ==='pages/codePay/codePay' ) {
      this.setData({
        pageRoute:1
      })
    }
    this.wxLogin()
  },
  //新增wx.getUserProfile接口
  userProfile: function (e) {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
    console.log("我")
  },
  //保存userInfo到DB
  wxLogin: function () {
    let that = this
    wx.login({
      success: res => {
        let code = res.code
        let argu = {
          code: code
        }
        getSession(argu).then((res) => {
          console.log(res)
          app.globalData.openId = res.openid;
          that.setData({
            openId: res.openid,
            sessionKey: res.session_key
          })
          wx.setStorageSync('openId', res.openid)
          wx.setStorageSync('sessionKey', res.session_key)
        })
      }
    });
  },
  getPhoneNumber: function (e) {
    console.log(e)
    if (this.data.openId=== '') {
      this.wxLogin();
    };
    
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      console.log(this.data.sessionKey)
      let argu = {
        sessionKey: this.data.sessionKey,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      getDecrypt(argu).then((res) => {
        console.log(res)
        var phone = res.phoneNumber
        console.log(phone)
        wx.checkSession({
          success: (res) => {
            console.log(res)
            let argu = {
              phone: phone
            }
            isRegister(argu).then((res) => {
              console.log(res)
              if (res.code === 200) {
                this.publicLogin(phone);
              } else if (res.code === 500) {
                let arg = {
                  phone: phone,
                  openId: this.data.openId
                }
                goRegister(arg).then((res) => {
                  if (res.code === 200) {
                    this.publicLogin(phone);
                  }
                })
              }
            })
          },
          fail:(res) => {
            console.log("session_key过期")
            this.wxLogin();
          }
        })
      })
    }
  },
  publicLogin: function (phone) {
    console.log(phone)
    let argu = {
      userName: phone,
      openId: this.data.openId
    }
    goSignin(argu).then((res) => {
      console.log(res)
      if (res.code === 200) {
        wx.setStorage({
          data: res.data.access_token,
          key: 'TOKEN',
        })
        app.globalData.token = res.data.access_token
        let pageRoute = this.data.pageRoute;
        console.log(pageRoute)
        if ( pageRoute===1) {
          wx.navigateBack({
            delta: 1,
          })
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  },
})