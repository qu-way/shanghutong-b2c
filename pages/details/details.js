import { getGoodsDetails, getGoodsRecommend, getCollection, getRecommendEvaluate,addCollection,cancelCollection,addShoppingCart} from '../../api/details.js';
import {loginNow,autoLogin} from '../../utils/util';
var app = getApp();

Page({
  /**
   * 组件的初始数据
   */
  data: {
    id:'',
    /**------------适配信息--------------- */
    windowHeight: 1500,
    titleHeight: 125,
    couponHeight: 40,
    body_titleHeight: 35,
    bottomHeight: 75,
    conentHeight: 1000,
    loading: true,
    //收藏状态更改
    isFavorite: false,
    cColor: '#666666',
    shoucang: "收藏",
    /**
     * 滑动窗滑动的位置
     * value:按照数组下标进行排序列
     */
    toView: 0,
    /**
     * 规格弹窗
     * 根据后端数据来定 
     */
    checkedSpecPrice: 0,
    number: 1,
    // checkedSpecText: '',
    // tmpSpecText: '请选择规格和数量',
    openAttr: false,
    soldout: false,
    disabled: '',
    alone_text: '单独购买',
    // 规格组
    specificationList: [],
    alone_text: '单独购买',
    userId: 0,
    priceChecked: false,
    goodsNumber: 0,
    // 规格id
    specNameId: '',
    /**
     * 当前页码
     */
    page: 1,

    /**
     * 是否有图
     * 1:无图评价 2：有图评价
     */
    type: 1,

    /**
     * 评分
     */
    score: 5,

    /**
     * 信息数据
     */
    appointmentData: {},
    /**
     * 评价数据
     */
    commitData: {},
    /**
     * 规格弹窗之前的e缓存
     */
    eventDetail: null,
    // 平台保障
    pingtai: false,
    // 配送方式
    peisong: false,
    // 提货地址
    tihuo: false,
    // 获取收藏列表
    collectionList: [],
    // 详情下拉
    activeNames: ['1'],
    //推荐商品
    recommendList:[],
    imgUrl:[{}]
  },
  /**
   * 初始化
   */

  initData(options) {
    console.log(options)
    /**
     * 获取商品详情列表
     */
    let argu = {
      id: options.id
    }
    getGoodsDetails(argu).then((res) => {
      let img = res.data.imgUrl
      let imaUrl = img.split(',');
      console.log(imaUrl)
      this.setData({
        detailsList: res.data,
        storeInfo: res.data.storeInfo,
        specificationList: res.data.specificationSelectList,
        id: options.id,
        imaUrl:imaUrl
      });
      let _specificationList = this.data.specificationList;
      console.log(_specificationList)
      // 如果仅仅存在一种货品，那么商品页面初始化时默认checked
      if (_specificationList.length === 1) {
        let that = this
        _specificationList[0].checked = true
        that.setData({
          checkedSpecText: _specificationList[0].goodsSpecificationName,
          tmpSpecText: _specificationList[0].goodsSpecificationName,
          specNameId: _specificationList[0].specificationId
        });
      } else {
        let that = this
        that.setData({
          checkedSpecText: '请选择规格和数量'
        });
      }
      console.log(this.data.checkedSpecText)
      console.log(this.data.specificationList)
    });

  
},
goodsRecommend() {
  let argu = {
    storeId: app.current.storeId,
    id:this.data.id
  }
  getGoodsRecommend(argu).then((res) => {
    this.setData({
      recommendList:res.data
    });
})
},
  onLoad: function (options) {
    console.log(options)
    this.initData(options);
    this.goodsRecommend(options)
    this.getRecommendEvaluate(options)
  },

  onShow: function () {
    if (app.globalData.token.length >= 1) {
      getCollection().then((res) => {
        if (res.code === 200) {
          let collectionList = res.data
          let goodsId = this.data.detailsList.id
          console.log(goodsId)
          let y = collectionList.findIndex((value) => value.goodsId == goodsId)
          console.log(y)
          if(y != -1){
            this.setData({
              isFavorite: true,
              cColor: "#e54148",
              shoucang: "已收藏"
            });
          }
        } else {
          wx.showToast({
            title: res.msg
          })
        }
        console.log(this.data.collectionList)
      })
    }
  },

  onReady:function() {
    let that = this
    // setTimeout(function(){
      that.setData({
        loading: false,
      });
    //  }, 200);
  },
  // 推荐评价
getRecommendEvaluate:function(id){
  console.log(id)
  let argu = {
    goodsId:id.id
  }
  getRecommendEvaluate(argu).then((res) => {
    console.log(res)
    this.setData({
      reList: res.data
    })
  })
},


  clickSkuValue: function (event) {
    console.log(event)
    // goods_specification中的id 要和product中的goods_specificationIds要一样
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;
    let index = event.currentTarget.dataset.index;
    //判断是否可以点击
    let _specificationList = this.data.specificationList;
    console.log(this.data.specificationList);
    for (let j = 0; j < _specificationList.length; j++) {
      if (_specificationList[j].specificationId == specValueId) {
        //如果已经选中，则反选
        if (_specificationList[j].checked === true) {
          _specificationList[j].checked = false;
          console.log(_specificationList[j].checked)
        } else {
          _specificationList[j].checked = true;
        }
      } else {
        _specificationList[j].checked = false;
      }
    }

    this.setData({
      'specificationList': _specificationList,
      specNameId: specNameId
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
  },
  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    let _checkedObj = {
      nameId: _specificationList.specificationId,
      valueId: 0,
      valueText: ''
    };
    for (let j = 0; j < _specificationList.length; j++) {
      if (_specificationList[j].checked) {
        _checkedObj.valueId = _specificationList[j].specificationId;
        _checkedObj.valueText = _specificationList[j].goodsSpecificationName;
      }
    }
    checkedValues.push(_checkedObj);
    return checkedValues;
  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {},
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },

  changeSpecInfo: function () {
    let checkedNameValue = this.getCheckedSpecValue();
    this.setData({
      disabled: '',
      number: 1
    });
    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        tmpSpecText: checkedValue.join('　'),
        priceChecked: true
      });
    } else {
      this.setData({
        tmpSpecText: '请选择规格和数量',
        priceChecked: false
      });
    }
    if (this.isCheckedAllSpec()) {
      this.setData({
        checkedSpecText: this.data.tmpSpecText,
        checkedSpecPrice: this.data.detailsList.price,
        soldout: true
      });
    } else {
      this.setData({
        checkedSpecText: '请选择规格和数量',
        checkedSpecPrice: this.data.detailsList.price,
        soldout: false
      });
    }
  },

  /**
   * 定位获取地址
   */
  choseLocation: function () {
    let storeInfo = this.data.storeInfo;
    let latitude = storeInfo.lat;
    let longitude = storeInfo.lng;
    let shopAddress = storeInfo.shopAddress;
    wx.openLocation({
      latitude,
      longitude,
      scale: 16,
      name: shopAddress
    })
  },

  // 分享
  onShareAppMessage: function (res) {
    var detailShare = this.data.detailsList
    if (res.from === 'button') {}
    return {
      title: detailShare.name,
      path: '/pages/deteils/details?id' + detailShare.id
    }
  },

  // 关闭half-screen-dialog
  close: function () {
    this.setData({
      pingtai: false,
      peisong: false,
      tyihuo: false
    });
  },
  // 显示平台保障
  openPingtai() {
    this.setData({
      pingtai: true
    });
  },
  // 显示配送方式
  openPeisong() {
    this.setData({
      peisong: true
    });
  },

  //添加个人收藏
  addCollec: function (e) {
    if (app.globalData.token.length < 1) {
      loginNow();
      return false
    }
    var isFavorite = this.data.isFavorite;
    if (!isFavorite) {
      this.setData({
        isFavorite: true
      })
      // 收藏接口
      var refId = this.data.detailsList.id;
      var collectionColor = this.data.color == '#E54148' ? '#E54148' : '#E54148';
      var argu = {
        type: 1,
        refId: refId
      }
      addCollection(argu).then((res) => {
        if (res.code == 200) {
          this.setData({
            cColor: collectionColor,
            shoucang: "已收藏"
          });
          wx.showToast({
            title: '收藏成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '收藏失败！',
            icon: 'error'
          })
        }
      });
    }
    //取消收藏
    else if (isFavorite) {
      if (app.globalData.token.length < 1) {
        loginNow();
        return false
      }
      var refId = this.data.detailsList.id;
      var collectionColor = this.data.color == '#666666' ? '#666666' : '#666666';
      this.setData({
        isFavorite: false
      })
      // 取消收藏
      var argu = {
        put: "true",
        refId: refId
      }
      cancelCollection(argu).then((data) => {
        if (data.code === 200) {
          this.setData({
            cColor: collectionColor,
            shoucang: "收藏"
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
  // 商品规格
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr
      });
    }
  },
  closeAttr: function () {
    this.setData({
      openAttr: false
    });
  },
  goMarketing: function (e) {
    let that = this;
    that.setData({
      showDialog: !this.data.showDialog
    });
  },
  //减少数量
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
    this.setData({
      disabled: ''
    });
  },
  //增加数量
  addNumber: function () {
    this.setData({
      number: Number(this.data.number) + 1
    });
  },

  //  加入购物车
  submitShopCar(argu) {
    var that = this;
    if (app.globalData.token.length < 1) {
      loginNow();
      return false
    }
    var productLength = this.data.specificationList.length;
    console.log(productLength)
    if (this.data.openAttr === false && productLength > 1) {
      //打开规格选择窗口
      this.setData({
        openAttr: !that.data.openAttr
      });
    } else if ( productLength===0){
      let shopDetails = this.data.detailsList
      var argu = {
        goodsId: shopDetails.id,
        goodsSpecificationId: "", //规格,
        buyNum: this.data.number
      }
      addShoppingCart(argu).then((data) => {
        if (data.code === 200) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'error',
            duration: 1000
          })
        }
      })
    } else {
      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          image: '/images/icon_error.png',
          title: '请选择规格',
        });
        return false;
      }
      this.closeAttr()
      let shopDetails = this.data.detailsList
      var argu = {
        goodsId: shopDetails.id,
        goodsSpecificationId: this.data.specNameId, //规格,
        buyNum: this.data.number
      }
      addShoppingCart(argu).then((data) => {
        if (data.code === 200) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'error',
            duration: 1000
          })
        }
      })
    }
  },

  detailOn(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  // 点击下单跳转付款页面，同时生成订单
  toPay() {
    if (app.globalData.token.length < 1) {
      loginNow();
      return false
    }
    var productLength = this.data.specificationList.length;
    console.log(productLength)
    if (this.data.openAttr === false && productLength > 1) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    } else if( productLength===0) {
      let details = this.data.detailsList
      let order1 = {
        goodsId: details.id,
        cover: details.cover,
        description: details.description,
        goodsCode: details.goodsCode,
        name: details.name,
        buyNum: 1,
        price: details.price,
        goodsSpecificationId: 0,
        goodsSpecificationName: "默认规格"
      }
      let list = []
      list.push(order1);
      wx.setStorage({
        key: 'ordersList',
        data: {
          storeName: this.data.storeInfo.storeName,
          storeId: this.data.storeInfo.id,
          total: details.price,
          cartList: list
        }
      });
      wx.navigateTo({
        url: "../pay/pay"
      })
    }else {
      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          image: '/images/icon_error.png',
          title: '请选择规格',
        });
        return false;
      }
      this.closeAttr()
      let details = this.data.detailsList
      let order1 = {
        goodsId: details.id,
        cover: details.cover,
        description: details.description,
        goodsCode: details.goodsCode,
        name: details.name,
        buyNum: 1,
        price: details.price,
        goodsSpecificationId: this.data.specNameId,
        goodsSpecificationName: this.data.checkedSpecText
      }
      let list = []
      list.push(order1);
      wx.setStorage({
        key: 'ordersList',
        data: {
          storeName: this.data.storeInfo.storeName,
          storeId: this.data.storeInfo.id,
          total: details.price,
          cartList: list
        }
      });
      wx.navigateTo({
        url: "../pay/pay"
      })
    }

    // });   
    // })
  },
  // 评论列表跳转
  // reviewList() {
  //   wx.navigateTo({
  //     url: '../reviewlist/reviewlist'
  //   })
  // },
  /**
   * 选择回调方法 没有选中就是空 选中了就是当前选的中文
   */
// 分享
  onShareAppMessage: function(res) {
    var that = this;
    //console.log('res=====',res);
    // if (res.from === 'button') {
      //console.log('来自页面内转发按钮');
    // } else if (res.from === 'menu'){
      //console.log('右上角菜单转发按钮');
    // }
    // 返回数据
    return {
      title: that.data.info.name,
      path: '/pages/details/details?id=' + that.data.id,
      success: function(res) {
        // 转发成功，可以把当前页面的链接发送给后端，用于记录当前页面被转发了多少次或其他业务
        // wx.request({
        //   url: app.buildUrl("/member/share"),
        //   data: {
        //     url: utils.getCurrentPageUrlWithArgs()
        //   },
        //   success: function(res) {
        //     //console.log('成功');
        //   }
        // });
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败")
      }
    }
  },


	goDetail: function (e) {
    console.log(e)
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/details/details?id=' + id
		})
	},


  //跳转到首页
  goIndex() {
    wx.switchTab({
      url: '../index/index'
    })
  },

  //跳转到购物车
  goCart() {
    wx.switchTab({
      url: '../shopCart/shopCart'
    })
  },

  onPullDownRefresh:function(){
    wx.showNavigationBarLoading();
    let options = {
      id:this.data.id
    } 
    console.log(options)
    this.initData(options);
    wx.hideNavigationBarLoading(); //完成停止加载图标
    wx.stopPullDownRefresh();
  }

})