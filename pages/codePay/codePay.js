import {
   offlinePayment,
   getWallet
} from '../../api/payment';
import {
   loginNow
} from '../../utils/util';
const pay = require('../../utils/payment.js');
import {
   getStoreInfoDetails
} from '../../api/store';
import {
   $h
} from '../../utils/util';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
var app = getApp();
Page({
   data: {
      money: 0,
      couponList: [],
      goldcoinList: [],
      explainData: "",
      coupon: false,
      items: [{
            value: '1',
            name: '自提'
         },
         {
            value: '2',
            name: '配送',
            checked: 'true'
         },
         {
            value: '3',
            name: '快递'
         }
      ],
      checked: false,
      consumer: false,
      explain: false,
      pay_close: false,
      pay_order_id: '',
      totalPrice: '0',
      storeId: '',
      needPayMoney: 0,
      actualPayMoney: 0,
      useCoupon: 0,
      couponIds: '',
      storeName: "",
      realCoupons: 0,
      realMoney: 0,
      canRadio:true
   },
   onLoad: function (e) {
      if (app.globalData.token.length < 1) {
         loginNow();
         return false
      }
      let storeId = e.storeId;
      console.log(e)
      console.log(storeId)
      this.searchStoreName(storeId)
   },
   onShow: function () {
      this.myWallet()
   },
   // 获取我的钱包
   myWallet() {
      getWallet().then((res) => {
         console.log(res)
         if (res.code === 200) {
            let couponsMoney = res.data.couponsMoney;
            this.setData({
               realCoupons: couponsMoney
            });
         }
         console.log(this.data.realCoupons)
      });
   },
   searchStoreName(e) {
      console.log(e)
      let argu = {
         id: e
      }
      getStoreInfoDetails(argu).then((res) => {
         if (res.code === 200) {
            this.setData({
               storeInfo: res.data,
               storeName: res.data.storeName,
            });
         } else {
            wx.showLoading({
               title: '正在加载数据',
            })
         }
      })
   },
   // 发起支付
   payHandler: function () {
      let storeInfo = this.data.storeInfo
      let openId = wx.getStorageSync('openId')
      let argu = {
         storeId: storeInfo.id,
         payId: openId,
         needPayMoney: this.data.money,
         actualPayMoney: this.data.money,
      }
      offlinePayment(argu).then(res => {

         // rightOffPay(argu).then((res) => {
         if (res.code === 200) {
            const payParam = res.data.prePayTnObj;
            console.log(res.data)
            console.log(payParam)
            wx.requestPayment({
               'timeStamp': payParam.timeStamp,
               'nonceStr': payParam.nonceStr,
               'package': payParam.package,
               'signType': payParam.signType,
               'paySign': payParam.paySign,
               'success': function (res) {
                  resolve(res);
               },
               'fail': function (res) {
                  wx.showToast({
                     title: '支付失败',
                     icon: 'error'
                  })
               },
               //  'complete': function (res) {
               //    reject(res);
               //  }
            });
         } else {
            reject(res);
         }
      })
      // })
   },
   // 输入框触发
   bindIptBlur: function (e) {
      let realCoupons = this.data.realCoupons;
      let money = e.detail.value;
      if (money < realCoupons) {
         realCoupons = money
      } else {
         realCoupons = realCoupons
      }
      console.log(e)
      this.setData({
         money: e.detail.value,
         realCoupons: realCoupons,
         canRadio: false
      })
   },

   // 金币反选与正选
   checkedTap: function (o) {
      console.log(o)
      var checked = this.data.checked;
      this.setData({
         "checked": !checked
      })
   },
   // 消费券正选与反选
   consumerTap: function (o) {
      let money = this.data.money
      if (money != 0) {
         console.log(o)
         var checked = this.data.checked;
         console.log(!checked)
         this.setData({
            checked: !checked,
            canRadio:false
         })
         if (!checked === true) {
            let realCoupons = this.data.realCoupons;
            console.log(realCoupons)
            let money = this.data.money;
            console.log(money)
            //用Number.isInteger()判断是否为整数
            if (Number.isInteger(realCoupons) && Number.isInteger(money)) {
               var realMoney = money - realCoupons
            } else {
               var realMoney = $h.Sub(money, realCoupons)
            }
            console.log(realMoney)
            this.setData({
               realMoney: realMoney
            })
         } else {
            return
         }
      } else {
         Notify('请先输入金额');
      }
   },
   // 选择优惠券
   radioChange(e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value)
      const items = this.data.items
      for (let i = 0, len = items.length; i < len; ++i) {
         items[i].checked = items[i].value === e.detail.value
      }
      this.setData({
         items
      })
   },


   /**
    * 事件回调
    * 
    */
   onChangeFun: function (e) {
      console.log(e)
      let opt = e.detail;
      let action = opt.action || null;
      let value = opt.value != undefined ? opt.value : null;
      (action && this[action]) && this[action](value);
   },

   // 显示优惠券
   openCoupon: function () {
      this.setData({
         coupon: true
      });
   },
   // 关闭half-screen-dialog
   close: function () {
      this.setData({
         coupon: false,
         explain: false
      });
   },
   confirm: function () {
      this.setData({
         coupon: false
      })
   },
   // 打开优惠说明
   openExplain: function () {
      this.setData({
         explain: true
      })
   }

})