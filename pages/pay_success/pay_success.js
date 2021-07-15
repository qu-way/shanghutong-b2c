// pages/pay_success/pay_success.js

var ownType= {
  onlyTable:'onlyTable',//预定
}

var app = getApp();

Page({

  /**
   * 组件的初始数据
   */
  data: {
    ownType:ownType,
    /**
     * 当前页面是哪里过来的
     */
    type:'',
    price:''
  },

  onLoad(options){
    var type = options.type|| '';
    this.setData({
      type:type
    })
    var price = options.price || 0;
    this.setData({
      price:price
    })
    this.propell();
  },
  checkOrder(){
    wx.switchTab({
      url: '../indent/indent'
    })
  }

})
