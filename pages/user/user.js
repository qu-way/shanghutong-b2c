import {
  getNumInfo,
  getUserInformation
} from '../../api/public.js';

var app = getApp();
import {
  loginNow
} from '../../utils/util';
Page({
  data: {
    userInfo: {},
    token: "",
    // URL:URL,
    datalist: false,
    orderItems: [{
        typeId: 0,
        name: '待付款',
        url: 'bill',
        imageurl: '/images/daizhifu.png',
      },
      {
        typeId: 1,
        name: '待发货',
        url: 'bill',
        imageurl: '/images/daifahuo.png',
      },
      {
        typeId: 2,
        name: '待收货',
        url: 'bill',
        imageurl: '/images/daishouhuo.png'
      },
      {
        typeId: 3,
        name: '待评价',
        url: 'bill',
        imageurl: '/images/daipingjia.png'
      }
    ],
    nickName:"",
    avatar:""
  },

  init: function () {
    getNumInfo().then((res) => {
      if (res.code === 200) {
        this.setData({
          numInfo: res.data
        })
      } else {
        wx.showToast({
          title: res.msg
        })
      }
      console.log(this.data.numInfo)
    })
  },
  // onLoad: function() {
  //   var token = app.globalData.token
  //   console.log(token)
  //   this.setData({
  //     token:token
  //   })
  // },
  onShow: function () {
    let token = app.globalData.token;
    this.setData({
      token:token
    })
    console.log(token)
    if (token) {
      this.getMyInfo()
      this.init()
    }
  },
  getMyInfo:function() {
    getUserInformation().then ((res => {
      console.log(res)
      if (res.code === 200) {
        this.setData({
          avatar:res.data.avatar,
          nickName:res.data.nickName
        })
      }
    }))
  },

  goLink2: function (event) {
    if (app.globalData.token.length < 1) {
      loginNow();
      return false
    }
    let link = event.currentTarget.dataset.link;
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: link
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }
  },
  goOrder: function (e) {
    let status = e.currentTarget.dataset.typeid
    wx.navigateTo({
      url: "/pages/order/order?typeId=" + status
    })
    this.getorder(status)
  },
  getorder(status){
    console.log(status)
  },
  // 客服
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  }
})