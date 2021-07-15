import { getOrderDetails,cancelOrder } from '../../api/order.js'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '订单详情',
      'color': true,
      'class': '0'
      // 'class': '2' 顶部为灰色
    },
    id: '',
    evaluate: 0,
    cartInfo: [], //购物车产品
    orderInfo: {
      system_store: {}
    }, //订单详情
    system_store: {},
    isGoodsReturn: false, //是否为退款订单
    isClose: false,
    payMode: [{
        name: "微信支付",
        icon: "icon-weixinzhifu",
        value: 'weixin',
        title: '微信快捷支付'
      },
      {
        name: "余额支付",
        icon: "icon-yuezhifu",
        value: 'yue',
        title: '可用余额:',
        number: 0
      },
    ],
    pay_close: false,
    pay_order_id: '',
    totalPrice: '0',
    generalActive: false,
    generalContent: {
      promoterNum: '',
      title: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let argu = options
    getOrderDetails(argu).then((res) => {
      console.log(res)
      this.setData({
        orderDetails: res.data,
        orderLists: res.data.detailList,
        num: res.data.detailList.length,
        id: options.id
      });
    });
  },
  openSubcribe: function (e) {
    let page = e.currentTarget.dataset.url;
    wx.showLoading({
      title: '正在加载',
    })
    openOrderRefundSubscribe().then(res => {
      wx.hideLoading();
      wx.navigateTo({
        url: page,
      });
    }).catch(() => {
      wx.hideLoading();
    });
  },
  /**
   * 事件回调
   * 
   */
  onChangeFun: function (e) {
    let opt = e.detail;
    let action = opt.action || null;
    let value = opt.value != undefined ? opt.value : null;
    (action && this[action]) && this[action](value);
  },
  /**
   * 拨打电话
   */
  makePhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.system_store.phone
    })
  },
  /**
   * 打开地图
   * 
   */
  showMaoLocation: function () {
    if (!this.data.system_store.latitude || !this.data.system_store.longitude) return app.Tips({
      title: '缺少经纬度信息无法查看地图！'
    });
    wx.openLocation({
      latitude: parseFloat(this.data.system_store.latitude),
      longitude: parseFloat(this.data.system_store.longitude),
      scale: 8,
      name: this.data.system_store.name,
      address: this.data.system_store.address + this.data.system_store.detailed_address,
      success: function () {
      },
    });
  },
  /**
   * 关闭支付组件
   * 
   */
  pay_close: function () {
    this.setData({
      pay_close: false
    });
  },
  /**
   * 打开支付组件
   * 
   */
  pay_open: function () {
    this.setData({
      pay_close: true,
      pay_order_id: this.data.orderInfo.order_id,
      totalPrice: this.data.orderInfo.pay_price
    });
  },
  /**
   * 支付成功回调
   * 
   */
  pay_complete: function () {
    this.setData({
      pay_close: false,
      pay_order_id: ''
    });
    this.getOrderInfo();
  },
  /**
   * 支付失败回调
   * 
   */
  pay_fail: function () {
    this.setData({
      pay_close: false,
      pay_order_id: ''
    });
  },
  /**
   * 登录授权回调
   * 
   */
  onLoadFun: function () {
    this.getOrderInfo();
    this.getUserInfo();
  },
  /**
   * 获取用户信息
   * 
   */
  getUserInfo: function () {
    let that = this;
    getUserInfo().then(res => {
      that.data.payMode[1].number = res.data.now_money;
      that.setData({
        payMode: that.data.payMode
      });
    })
  },
  /**
   * 获取订单详细信息
   * 
   */
  getOrderInfo: function () {
    var that = this;
    wx.showLoading({
      title: "正在加载中"
    });
    //获取订单详情
    getOrderDetail(this.data.order_id).then(res => {
      let _type = res.data._status._type;
      wx.hideLoading();
      that.setData({
        orderInfo: res.data,
        cartInfo: res.data.cartInfo,
        evaluate: _type == 3 ? 3 : 0,
        system_store: res.data.system_store,
      });
      if (this.data.orderInfo.refund_status != 0) {
        this.setData({
          'parameter.class': '2',
          isGoodsReturn: true
        });
        this.selectComponent('#navbar').setClass();
      }
      that.getOrderStatus();
    }).catch(err => {
      wx.hideLoading();
      app.Tips({
        title: err
      }, '/pages/order_list/index');
    });
  },


  /**
   * 再此购买
   */
  goOrderConfirm: function (e) {
    console.log(e)
    // 再次购买
    // cancelOrder( that.data.orderInfo.order_id ).then(res=>{
    //    return wx.navigateTo({ url: '/pages/pay/pay?cartId=' + res.data.cateId });
    // });
    let storeId = e.currentTarget.dataset.storeId
    console.log(storeId)
    wx.navigateTo({
      url: '../shop/shop?storeId=' + storeId
    })
  },
  //取消/删除订单
  cancelOrder: function () {
    let id = this.data.id
    var that = this;
    wx.showModal({
      title: '删除订单',
      content: '确定删除该订单吗？',
      confirmColor: '#F75451',
      success(res) {
        if (res.confirm) {
          console.log(id)
          let argu = {
            id: id
          }
          cancelOrder(argu).then((res) => {
            if (res.code === 200) {
              wx.navigateBack({
                delta: 1,
              })
            } else {
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
  confirmOrder: function () {
    var that = this;
    wx.showModal({
      title: '确认收货',
      content: '为保障权益，请收到货确认无误后，再确认收货',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            title: '加载中',
          })
          orderTake(that.data.order_id).then(res => {
            wx.hideLoading();
            const generalContent = "generalContent.promoterNum";
            const title = "generalContent.title";
            if (res.data.gain_integral != "0.00" && res.data.gain_coupon != "0.00") {
              that.setData({
                generalActive: true,
                [generalContent]: `恭喜您获得${res.data.gain_coupon}元优惠券以及${res.data.gain_integral}积分，购买商品时可抵现哦～`,
                [title]: '恭喜您获得优惠礼包'
              });
              return;
            } else if (res.data.gain_integral != "0.00") {
              that.setData({
                generalActive: true,
                [generalContent]: `恭喜您获得${res.data.gain_integral}积分，购买商品时可抵现哦～`,
                [title]: '赠送积分'
              });
              return;
            } else if (res.data.gain_coupon != "0.00") {
              that.setData({
                generalActive: true,
                [generalContent]: `恭喜您获得${res.data.gain_coupon}元优惠券，购买商品时可抵现哦～`,
                [title]: '恭喜您获得优惠券'
              });
              return;
            } else {
              return app.Tips({
                title: '操作成功',
                icon: 'success'
              }, function () {
                that.getOrderInfo();
              });
            }
          }).catch(err => {
            return app.Tips({
              title: err
            });
          })
        }
      }
    })
  },
  generalWindow: function () {
    this.setData({
      generalActive: false
    });
    this.getOrderInfo();
  },
  /**
   * 
   * 删除订单
   */
  delOrder: function () {
    var that = this;
    orderDel(this.data.order_id).then(res => {
      return app.Tips({
        title: '删除成功',
        icon: 'success'
      }, {
        tab: 3,
        url: 1
      });
    }).catch(err => {
      return app.Tips({
        title: err
      });
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLog && this.data.isClose) {
      this.getOrderInfo();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isClose: true
    });
  },
})