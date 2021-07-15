import {userEdit} from '../../api/user.js';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import { HTTP_REQUEST_URL} from '../../config.js';
import {uploadFile} from '../../api/public.js'
import {
  getUserInformation
} from '../../api/public.js';
import authLogin from '../../utils/autuLogin.js';
import util from '../../utils/util.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    loginType: 'app',//app.globalData.loginType
    userIndex: 0,
    switchUserInfo:[],
    avatar:"",
    nickname: {
      name: "用户昵称",
      value: "0"
    },
    telephone: {
      name: "请输入",
      value: "0"
    },
    isNick:false
  },
  /**
  * 小程序设置
 */
  Setting: function () {
    wx.openSetting({
      success: function (res) {
        console.log(res.authSetting)
      }
    });
  }, 

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
  },

  /**
   * 退出登录
   * 
  */
  outLogin:function(){
    if (this.data.loginType == 'app'){
      app.globalData.token = '';
      // app.globalData.isLog = false;
      app.globalData.userInfo = {};
      app.globalData.expiresTime = 0;
      wx.showLoading({
        title: '正在退出登录',
      });
      return wx.switchTab({
        url: '/pages/index/index',
        success: function () {
          wx.hideLoading();
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getMyInfo()
    
  },
  getPhoneNumber:function(e){
    var detail = e.detail, cache_key = wx.getStorageSync('cache_key'),that=this;
    if (detail.errMsg =='getPhoneNumber:ok'){
      if (!cache_key){
        app.globalData.token='';
        app.globalData.isLog=false;
        return false;
      }
    }else{
      app.Tips({ title:'取消授权'});
    }
  },

  /**
   * 获取用户详情
  */
 getMyInfo:function() {
  getUserInformation().then ((res => {
    console.log(res)
    if (res.code === 200) {
      console.log(res.data)
      this.setData({
        avatar:res.data.avatar,
        nickname: {
          name: res.data.nickName,
          value: "0"
        },
        telephone: {
          name: res.data.phone,
          value: "0"
        },
      })
    }
    console.log(this.data.nickname)
    console.log(this.data.telephone)
  }))
},

  /**
  * 上传文件
  * 
 */
  uploadpic: function () {
    var that = this;
    console.log(this.data.avatar)
    util.uploadImageOne('oss/uploadFileList', function (res){
      console.log(res)
      let argu = {
        avatar:res.data.url
      }
      that.setData({
        avatar: argu.avatar
      });
      userEdit(argu).then( res => {
        console.log(res)
        if (res.code === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'error'
          })
        }
      })
    });
  },
  formSubmit1: function(e) {
    console.log(e)
    var nickName = e.detail.value.nickName
    if ( !nickName ) {
      Notify('昵称不能为空');
    } else {
      let argu = {
        nickName:nickName
      }
      console.log(argu)
      userEdit(argu).then( res => {
        console.log(res)
        if (res.code === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000);
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'error'
          })
        }
      })
    }
  },

  
  openNick() {
		this.setData({
			isNick: true
		});
  },
  openPhone() {
		this.setData({
			isPhone: true
		});
  },
  closeNick () {
		this.setData({
			isNick: false
		});
  },
  closePhone (){
   this.setData({
    isPhone:false
   })
  },
  closeAvatar () {
    this.setData({
      isAvatar:false
     })
  },
  formSubmit2: function(e) {
    console.log(e)
    var cPhone = e.detail.value.contactPhone
    if ( !cPhone ) {
      Notify('联系电话不能为空');
    } else {
      let argu = {
        contactPhone:cPhone
      }
      userEdit(argu).then( res => {
        console.log(res)
        if (res.code === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000);
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'error'
          })
        }
      })
    }
  },

})