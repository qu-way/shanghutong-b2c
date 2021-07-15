Page({
  copyOrderId(){
    let that = this
    wx.setClipboardData({
      //准备复制的数据
      //  data: that.data.detailInfo.orderId,
       success: function (res) {
         wx.showToast({
           title: '复制成功',
         });
       }
     });
 
  },
})