import {
   rightOffPay
} from '../../api/payment';
import {
   getSession
} from '../../api/register';

Page({
   data: {
      state: false,
      displays: false
   },
   onLoad: function (e) {
      console.log(e)
      this.wxLogin(e.orderId)
   },
   // 获取openId
   wxLogin: function (e) {
      wx.login({
         success: res => {
            let code = res.code
            let argu = {
               code: code
            }
            getSession(argu).then((res) => {
               let openIdAndId = {
                  payId: res.openid,
                  orderId: e
               }
               this.payRight(openIdAndId)
            })
         }
      });
   },
   //立即支付
   payRight: function (openIdAndId) {
      let that = this
      let argu = {
         payChannel: "WECHAT",
         payId: openIdAndId.payId,
         id: openIdAndId.orderId
      }
   
      rightOffPay(argu).then((res) => {
         if (res.code === 200) {
            const payParam = res.data.prePayTnObj;
            console.log(res.data)
            wx.requestPayment({
               'timeStamp': payParam.timeStamp,
               'nonceStr': payParam.nonceStr,
               'package': payParam.package,
               'signType': payParam.signType,
               'paySign': payParam.paySign,
               'success': function () {
                  that.setData({
                     state: true
                  })
               },
               'fail': function () {
                  that.setData({
                     state: false
                  })
               },
               'complete': function () {
                  that.setData({
                     displays: true
                  });
               }
            });
         } else {
            wx.showToast({
               title: '订单提交失败',
               icon: 'error'
             })
         }
      })
   },
   // 返回APP
   launchAppError(e) {
      console.log(e.detail.errMsg)
   },
   goIndex() {
      wx.navigateTo({
        url: 'pages/index/index',
      })
   }
})