import {
  getCollection
} from '../../api/user'

import {
  loginNow
} from '../../utils/util';
var app = getApp();

Page({
  data: {
    shopList: []
  },
  onLoad: function(options) {
    if (app.globalData.token.length < 1) {
      loginNow();
      return false
    }
    this.initData(options)
  },
  initData(options) {
    getCollection().then((res) => {
      if (res.code === 200) {
        this.setData({
          collectionList: res.data
        })
      } else {
        wx.showToast({
          title: res.msg
        })
      }
      console.log('收藏列表');
      console.log(this.data.collectionList)
    }).catch((e) => {
      wx.showToast({
        title: e.msg ? e.msg : '您还没有收藏',
        icon: 'loading'
      })
    })
  },
  handleToInsertAddress() {
    wx.navigateTo({
      url: '../place/place/add'
    })
  },
  // 跳转商品详情
  goDetail(e) {
    let id = e.currentTarget.dataset.id;
    console.log('商品id', id);
		wx.navigateTo({
			url: '/pages/details/details?id=' + id
		})
  }
});
