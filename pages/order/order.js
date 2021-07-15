import { getOrderList,cancelOrder } from '../../api/order.js';
const pay = require('../../utils/payment.js');

var app = getApp();
Page({
  data: {
    page: 1,
    theme_type: '',
    status: null,
    storeType:2,
    tabs: [{
        id: null,
        name: '全部'
      },
      {
        id: 0,
        name: '待付款'
      },
      {
        id: 1,
        name: '待发货'
      },
      {
        id: 2,
        name: '待收货'
      },
      {
        id: 10,
        name: '待评价'
      }
    ],
    // 过期时间
    time: 0,
    loading:true
  },
  onLoad: function (options) {
    let {
      status,
      is_show_tip,
      isfail
    } = options;
    wx.showLoading({
      title: '加载中',
    });
    if (status === undefined) {
      status = null;
    }
    this.setData({
      status: status,
      time: 2 * 60 * 60 * 1000
    })
    if (is_show_tip != undefined && is_show_tip == 1) {
      wx.showToast({
        title: '支付成功',
      })
    } else if (isfail != undefined && isfail == 1) {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    }
    this.getData();
  },
  onReady:function(){
      this.setData({
        loading: false,
      });
  },
  getData: function () {
    this.setData({
      isHideLoadMore: true
    })
    console.log(this.data.status)
    var argu = {
      status: this.data.status,
      storeType: this.data.storeType
    }
    console.log(this.data.status)
    getOrderList(argu).then((res) => {
      console.log(res)
      wx.hideLoading();
      this.setData({
        orderList: res.data
      });
    });
  },
  goOrderDetail: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.orderId
    let url = `/pages/orderDetail/orderDetail?id=${id}`;
      wx.navigateTo({
        url
      })
  },
  receivOrder: function (event) {
    let id = event.currentTarget.dataset.type;
    let delivery = event.currentTarget.dataset.delivery;
    var token = app.globalData.token;
    if (delivery == "pickup") content = "确认提货";
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认收到', 
      confirmColor: '#F75451',
      success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/index',
            'data': {
              controller: 'order.receive_order',
              token: token,
              order_id: id
            },
            dataType: 'json',
            success: function (res) {
              if (res.data.code == 0) {
                wx.showToast({
                  title: '收货成功',
                  icon: 'success',
                  duration: 1000
                })
                that.order(that.data.status);
              }
            }
          })
        }
      }
    })
  },
  cancelOrder: function (event) {
    let id = event.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '取消支付',
      content: '好不容易挑出来，确定要取消吗？',
      confirmColor: '#F75451',
      success(res) {
        if (res.confirm) {
          console.log(id)
          let argu = {
            id:id
          }
          cancelOrder(argu).then((res)=>{
            if(res.code===200) {
              that.getData()
            } else{
              wx.showToast({
                title: '取消失败',
                icon: 'error',
                duration: 2000
                })
            }
          })
        }
      }
    })
  },

  goRefund: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/refund/applyRefund/applyRefund?id=' + id,
    })
  },

  getOrder: function (event) {
    wx.showLoading({
      title: '加载中',
    });
    let starus = event.target.dataset.type;
    this.order(starus);
  },

  getOrderJs:function (e) {
    console.log(e)
    let starus = e.type;
    this.order(starus);
  },

  order: function (starus) {
    var that = this;
    that.setData({
      status: starus,
      order: [],
      no_order: 0,
      page: 1
    })
    this.getData();
  },
  viewLogistics(e) {
    let orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/logistics/logistics?orderId=' + orderId,
    })
  },
  orderPay: function (e) {
    console.log(e)
    let orderId = e.currentTarget.dataset.id;
    console.log(orderId)
    pay.payOrder(orderId).then(res => {
      let type = {
        type:1
      }
      this.getOrderJs(type)
    })
  },

  onReachBottom: function () {
    if (this.data.no_order == 1) return false;
    this.data.page += 1;
    this.getData();
    this.setData({
      isHideLoadMore: false
    })
  },

  onPullDownRefresh: function () {
    this.setData({
      is_empty: false,
      page: 1,
      order: []
    })
    wx.showLoading();
    this.getData();
    wx.stopPullDownRefresh();
  }


})