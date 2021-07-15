import {
  getUserInformation
} from '../../api/public.js';
const app=getApp();
Page({
  data:{
    userInfo:{},
    token:'',
    avatar:[]
  },
  // onLoad:function() {
  //   this.getMyInfo()
  // },
  onShow(){
    this.getMyInfo()
  },
  getMyInfo:function() {
    getUserInformation().then ((res => {
      console.log(res)
      if (res.code === 200) {
        this.setData({
          avatar:res.data.avatar,
          nickName:res.data.nickName
        })
      }
    }))
  },
  outsign:function(){
    if(app.globalData.token.length>1){
      wx.showModal({
        title:'您确定要退出吗',
        success:(res)=>{
          if(res.confirm){
            wx.removeStorageSync('TOKEN')
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
  },
  aboutUs:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/user_info/index',
    })
  }
})