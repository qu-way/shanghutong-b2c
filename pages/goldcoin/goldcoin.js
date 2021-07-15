import {
  loginNow,
  formatTime
} from '../../utils/util';
import {
  getWallet
} from '../../api/payment';

Page({
  data: {
    calendarflag: false,
    data: [],
    count: 1,
    score: 0,
    page: 1,
    signData: {},
    couponsMoney:0
  },
  onLoad: function (options) {
    var time = formatTime(new Date());
    this.setData({
      time: time.split(" ")[0].split('/')
    });
  },
  onShow: function () {
    this.myWallet()
  },
  //点击签到显示签到弹窗，并调取签到接口
  showcalendar() {
    this.goSign();
  },
  // 获取我的钱包
  myWallet() {
    getWallet().then((res) => {
      console.log(res)
      if (res.code === 200) {
        let couponsMoney = res.data.couponsMoney;
        this.setData({
          couponsMoney: couponsMoney
        });
      }
      console.log(this.data.realCoupons)
    });
  },
  //关闭弹窗
  showcalendarClose() {
    this.setData({
      calendarflag: !this.data.calendarflag
    })
  },

  goIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})