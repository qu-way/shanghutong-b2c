const app=getApp();
Page({
  data:{
    userInfo:{},
    token:''
  },
  onShow(){
    var userInfo=wx.getStorageSync('userInfo')
    var token=wx.getStorageSync('token')
    this.setData({
      userInfo,
      token
    })
  },
  outsign:function(){
    if(app.globalData.token.length>1){
      wx.showModal({
        title:'您确定要退出吗',
        success:(res)=>{
          if(res.confirm){
            app.globalData.token='';
            app.globalData.code='';
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }else if(res.cancel){
            console.log('用户点击取消');
          }
          wx.switchTab({
            url: '/pages/user/user'
          })
        }
      })
    }else{
      wx.showToast({
        title: '请登录',
        icon:'none',
        duration:2000
      })
    }
  }
})