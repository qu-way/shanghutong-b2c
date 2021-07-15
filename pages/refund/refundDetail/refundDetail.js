import {
  postRefundDetail
} from '../../../api/order.js';

import {postRefundcancel} from '../../../api/order.js';

Page({
      data: {
        id:'',
        stepsData: [{
            key: 0,
            value: "待审核"
          },
          {
            key: 4,
            value: "待退款"
          },
          {
            key: 10,
            value: "已完成"
          },

          {
            key: 20,
            value: "退货关闭"
          }
        ],
        stepStatus: '',
        stepValue:''
      },

      onLoad: function (e) {
        console.log(e)
        let argu = {
          id: e.id
        }
        postRefundDetail(argu).then((res) => {
              var status = res.data.status
              var stepsData = this.data.stepsData
              var stepValue
              for (let i =0;i<stepsData.length;i++) {
                if (status == stepsData[i].key) {
                  stepValue = stepsData[i].value; 
                }
              }
                console.log(stepValue)
                this.setData({
                  refundDetail: res.data,
                  stepStatus: res.data.status,
                  stepValue: stepValue,
                  id:e.id
                })
            })
          },

          /**
           * 复制订单号
           */
          copyNumbers: function (e) {
            console.log(e)
            var orderId = e.currentTarget.dataset.orderId
            wx.setClipboardData({
              data: orderId,
              success(res) {
                wx.getClipboardData({
                  success(res) {
                    console.log(res.data) // data
                  }
                })
              }
            })
          },

          // 撤销退款
          refundcancel:function(){
            var id= this.data.id
            console.log(id)
                wx.showModal({
                  title: '撤销退款/退货',
                  content: '请问是否确认撤销吗？',
                  success (res) {
                    if (res.confirm) {
                      var argu= {
                        id:id
                      }
                      postRefundcancel(argu).then((res)=>{
                        if(res.code=='200'){
                          wx.showToast({
                            title: '撤销成功',
                            icon: 'success',
                            duration: 1000
                          })
                    }
                  })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
          },

          goApplyRefund: function(e) {
            console.log(e)
            // let orderId = e.currentTarget.dataset.orderId
            // let orderItemId = e.currentTarget.dataset.orderItemId
            // wx.navigateTo({
            //   url: '/pages/refund/modifyRefund/modifyRefund?orderId=' + orderId + '&orderItemId=' + orderItemId,
            // })

            let id = e.currentTarget.dataset.orderId
            wx.navigateTo({
              url: '/pages/refund/applyRefund/applyRefund?id=' + id
            })
          }


      });