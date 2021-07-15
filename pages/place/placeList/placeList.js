import {getUserAddress} from '../../../api/address'
var app = getApp();

Page({
  data: {
    locationList: [],
    defaultIn: null,
    tag: 1,
    createTime: null,
    updateTime: null,
    deleted: 0
  },
  onShow: function (options) {
    this.initData(options)
  },
  initData(options) {
    getUserAddress().then((res) => {
      if (res.code === 200) {
        this.setData({
          locationList: res.data
        })
      } else {
        wx.showToast({
          title: res.msg
        })
      }
    }).catch((e) => {
      wx.showToast({
        title: e.msg ? e.msg : '暂无地址',
        icon: 'loading'
      })
    })
  },
  selectAddress(e) {
    let comePage = getCurrentPages()
    console.log(comePage)
    if (comePage.length >= 2) {
      let prevpage = comePage[comePage.length - 2]
      console.log(prevpage.route)
      if (prevpage.route == 'pages/pay/pay'||'pages/place/edit'||'pages/place/add'||'pages/pays/pays') {
        let addressId = e.currentTarget.dataset.id
        wx.setStorageSync('addressId', addressId);
        wx.navigateBack();
      }
    }
  }

});