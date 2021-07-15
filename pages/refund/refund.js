import { postRefundList,postRefundcancel } from '../../api/order.js';
Page({
  data:{
    storeName: "",
    title:"",
    guige: "200G",
    price: "200",
    shifu: "120",
    tuikuan: "120",
    refundList:[]
  },
  onLoad: function (e) {
    postRefundList().then((res) => {
      console.log(res)
      this.setData({
        refundList:res.data
      })
    })
  },
  onReady:function(){
    this.showBtn = this.selectComponent("#showBtn")
  },
  delete(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '取消退款/退货',
      content: '请问是否确认取消吗？',
      success (res) {
        if (res.confirm) {
          var argu= {
            id:id
          }
          postRefundcancel(argu).then((res)=>{
            if(res.code=='200'){
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(() => {
                wx.switchTab({
                  url:'/pages/user/user'
                })
              }, 1000);
        } else {
          wx.showToast({
            title: '取消失败',
            icon: 'error',
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
  onCancel(){
    this.showBtn.hideshowBtn()
  },
  onConfirm(){
    this.showBtn.hideshowBtn()
  },
  
})