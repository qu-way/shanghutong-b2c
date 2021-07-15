import { searchCollection,getStoreInfoDetails,addCollection,cancelCollection} from '../../api/store'
import {loginNow} from '../../utils/util';
var app = getApp();


Page({
  data: {
    // URL: URL,
    /**
     * 店铺Id
     */
    storeId: '',
    refId: '',
    logoUrl: '',
    phone: '13212677668', //手机号码
    title: '', //店铺名称
    address: '', //店铺地址
    opentimes: "", //服务时间
    affiche: '', //公告
    star: [], //星级
    // latitude: null, //经度
    // longitude: null, //维度

  },

  onLoad: function (options) {
    this.initData(options);
  },
  onShow: function () {
    if (app.globalData.token.length < 1) {
      return false
    } else {
      searchCollection().then((res) => {
        let abc = res.data
        for ( let i = 0; i < res.data.length; i++ ) {
          let efg = abc[i].refId
          let hij = efg.indexOf(this.data.storeId)
          if (hij === 0) {
            this.setData({
              isFollow: true
            })
          }
        }
      })
    }
  },
  /**
   * 第一次进入界面请求数据
   */
  initData(options) {
    console.log(options)
    console.log(this.data.follow)
    var argu = {
      id: options.storeId
    }
    getStoreInfoDetails(argu).then((res) => {
      if (res.code === 200) {
        this.setData({
          storeDetails:res.data,
          refId: res.data.id,
        });
      } else {
        wx.showLoading({
          title: '正在加载数据',
        })
      }
    })
  },

  //关注与取关
  attentionClear(e) {
    if (app.globalData.token.length < 1) {
      loginNow();
      return false
    }
    var isFollow = this.data.isFollow;
    if (!isFollow) {
      this.setData({
        isFollow: true
      })
      var refId = this.data.refId;
      var argu = {
        type: 2,
        refId: refId
      }
      addCollection(argu).then((res) => {
        if (res.code === 200) {
          this.setData({
            shoucang: "已关注"
          });
          wx.showToast({
            title: '关注成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '关注失败！',
            icon: 'error'
          })
        }
      });
    }
    //取消关注
    else if (isFollow) {
      if (app.globalData.token.length < 1) {
        loginNow();
        return false
      }
      var refId = this.data.refId;
      this.setData({
        isFollow: false
      })
      // 取消关注
      var argu = {
        put: "true",
        refId: refId
      }
      cancelCollection(argu).then((data) => {
        if (data.code === 200) {
          this.setData({
            shoucang: "关注"
          });
          wx.showToast({
            title: '取消成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '取消失败',
            icon: 'error'
          })
        }
      });
    }
  },
  /**
   * 定位获取地址
   */
  choseLocation: function () {
    let storeDetails = this.data.storeDetails;
    let latitude = storeDetails.lng;
    let longitude = storeDetails.lat;
    let shopAddress = storeDetails.shopAddress;
    wx.openLocation({
      latitude,
      longitude,
      scale: 16,
      name: shopAddress
    })
  },

  // 拨打电话
  toCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  //电话弹窗
  open: function () {
    var itemList = [];
    itemList = itemList.push(this.data.telephone.toString()) ? itemList : [];
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (!res.cancel) {
          wx.makePhoneCall({
            phoneNumber: itemList[res.tapIndex]
          })
        }
      }
    });
  },
  //调取手机相机扫码
  scanCode() {
    wx.scanCode({
      success: (res) => {}
    })
  }
})