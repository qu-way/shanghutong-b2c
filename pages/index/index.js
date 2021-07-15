import {
  getBannerList,
  getStoreList,
  getCity,
  searchAddressCity,
  getGridList,
  getIndustry,
  getNotice
} from '../../api/index.js';
import wxh from '../../utils/wxh.js';
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const app = getApp()
Page({
  data: {
    // 骨架屏2
    loading: true,
    showSkeleton: true,
    dropDownMenuTitle: ['区域', '品类', '综合排序', '筛选'],
    data3: [{
        id: 1,
        title: '距离最近'
      },
      {
        id: 2,
        title: '评分最高'
      }
    ],
    data4: [{
      id: 1,
      title: '可快递'
    }, {
      id: 2,
      title: '可配送'
    }, {
      id: 3,
      title: '可自提'
    }],
    windowHeight: app.globalData.windowHeight,
    // URL: URL,
    near: app.near,
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    // idx: 0,
    /**
     * 是否在搜索状态
     */
    searchBool: false,
    /**
     * 当前城市名字
     */
    cityName: "",
    /**
     * 首页bnner数据
     */
    banner_indexData: [{
        banner: "../../images/12.jpg"
      },
      {
        banner: "../../images/13.jpg"
      }
    ],
    /**
     * 图片选择
     */
    pics: [],
    /**
     * 当前页码
     */
    page: 1,
    /**
     * 总条数
     */
    count: 1,
    // 筛选初始化
    shopCity: "",
    shopArea: "",
    shopTown: "",
    lng: 0,
    lat: 0,
    type: 1,
    industry: "",
    sortType: 1,
    shopFwTypes: 0,
    // 行业分类列表
    industryList: [],
    //根据城市查询地址列表
    addressList: [],
    gridList: [],
    isHidden:false,
    // 公告
    noticeData:[],
    distance:[]
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    let argu = {
      advertType: 3
    }
    getBannerList(argu).then((res) => {
      this.setData({
        banner_indexData: res.data
      });
      console.log(this.data.banner_indexData)
    })
    let that = this
    that.industry();
    this.gridList();
    if (wx.getStorageSync('msg_key')) this.setData({ isHidden:true});
  },

  onShow: function () {
    var cityName = wx.getStorageSync('cityName')
    this.initData();
    this.getNotice()
  },

  onReady() {
    let that = this
      that.setData({
        loading: false,
      });
  },
  getNotice() {
    getNotice(3).then((res) => {
      if(res.code===200) {
        this.setData({
          noticeData:res.data
        })
      }
    })
  },
 
  /**
   * 初始化数据
   */
  initData: function () {
    qqmapsdk = new QQMapWX({
      key: '3WEBZ-5TTW2-3WLUH-CW7ZE-MPCBF-GXFCC'
    });
    let _this = this
    if (app.oneDayOneLogin === true) {
      wxh.selfLocation().then((res) => {
        console.log(res)
        app.globalData.cityData.lat = res.latitude
        app.globalData.cityData.lng = res.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.address_component.city.slice(0, 2);
            wx.setStorage({
              data: address,
              key: 'cityName',
            })
            var argu = {
              lat: res.latitude,
              lng: res.longitude,
              shopCity: address,
              shopArea: _this.data.shopArea,
              shopTown: _this.data.shopTown,
              industry: _this.data.industry,
              sortType: _this.data.sortType,
              shopFwTypes: _this.data.shopFwTypes,
              type: 2
            }
            let arg = {
              cityName: address
            }
            searchAddressCity(arg).then((res) => {
              console.log(res)
              let addressleft = res.data[0].addressDistricts;
              _this.setData({
                addressList: addressleft,
                cityName: address
              });
            })
            return getStoreList(argu).then((res)=> {
              _this.setData({
                storeList: res.data
              })
            })
          }
        })
      })
      app.oneDayOneLogin = false;
    } else {
      console.log(app.oneDayOneLogin)
      this.getIndexShop()
    }
  },
  gridList() {
    getGridList().then((res) => {
      console.log(res.data)
      this.setData({
        gridList: res.data
      })
    })
  },
  /**
   * 重新获取店铺数据
   */
  getIndexShop: function () {
    let that = this
    let longitude = wx.getStorageSync('LONGITUDE'); //经度
    let latitude = wx.getStorageSync('LATITUDE'); //纬度
    let cityName =  wx.getStorageSync('cityName'); 
    var argu = {
      lat: latitude,
      lng: longitude,
      shopCity: cityName,
      shopArea: this.data.shopArea,
      shopTown: this.data.shopTown,
      industry: this.data.industry,
      sortType: this.data.sortType,
      shopFwTypes: this.data.shopFwTypes,
      type: 2
    }
    getStoreList(argu).then((res) => {
      that.setData({
        storeList: res.data,
        cityName: cityName,
        count: 1
      });
    })
  },

  // 获取行业数据
  industry: function () {
    let that = this
    let argu = {
      dictType: "industry"
    }
    getIndustry(argu).then((res) => {
      let industryList = res.data
      let indu = [{
        dictValue: '',
        dictLabel: "不限"
      }]
      let cate = indu.concat(industryList);
      that.setData({
        industryList: cate
      });
    })
  },

  closeTip:function(){
    wx.setStorageSync('msg_key',true);
    this.setData({
      isHidden:true
    })
  },

  /**
   * 页面下拉触底事件
   */
  indexScrollTo(e) {
    console.log(e)
    wx.pageScrollTo({
      scrollTop: e.target.offsetTop - 1,
      duration: 300
    });
  },
  /**
   * 导航到商家主页
   */
  toShop(e) {
    console.log(e)
    app.current.storeId = e.currentTarget.dataset.storeId;
    app.current.storeName = e.currentTarget.dataset.storeName;
    wx.navigateTo({
      url: '../shop/shop?storeId=' + e.currentTarget.dataset.storeId
    })
  },
  toSwichtcity() {
    wx.navigateTo({
      url: '/pages/switchcity/switchcity'
    })
  },

  goNoticeList() {
    wx.navigateTo({
      url: '/pages/noticeList/noticeList'
    })
  },
  //店铺列表
  toshopList(e) {
    console.log(e)
    let index = e.currentTarget.dataset.title;
    let mainCategoryId = e.currentTarget.dataset.id
    console.log(index)
    wx.navigateTo({
      url: '../shopList/shopList?menuType=' + index + '&mainCategoryId=' + mainCategoryId
    })
    // this.setData({
    //   idx: e.currentTarget.dataset.index
    // })
  },
  // 筛选
  // 总
  selectedItem: function (e) {
    console.log(e)
    if (e.detail.index === "1") {
      let selectedTitle = e.detail.selectedTitle;
      if (selectedTitle === "不限") {
        this.setData({
          shopTown: ""
        })
      } else {
        this.setData({
          shopTown: selectedTitle
        })
      }

    }
    if (e.detail.index === "2") {
      let selectedTitle = e.detail.selectedTitle;
      if (selectedTitle === "不限") {
        this.setData({
          industry: ""
        })
      } else {
        this.setData({
          industry: selectedTitle
        })
      }
    }
    if (e.detail.index === 3) {
      let selectedId = e.detail.selectedId
      if (selectedId === 1) {
        this.setData({
          sortType: 0
        })
      }
      if (selectedId === 2) {
        this.setData({
          sortType: 2
        })
      }
    }
    if (e.detail.index === "4") {
      let selectedId = e.detail.selectedId
      if (selectedId === 1) {
        this.setData({
          shopFwTypes: 1
        })
      }
      if (selectedId === 2) {
        this.setData({
          shopFwTypes: 2
        })
      }
      if (selectedId === 3) {
        this.setData({
          shopFwTypes: 3
        })
      }
    }
    this.getIndexShop();
  },


  // 翻页
  // next() {
  //   if (this.data.searchBool) {
  //     this.nextSearchPage();
  //   } else {
  //     this.nextPage();
  //   }
  // },
  /**
   * 下一頁
   */
  // nextPage() {
  //   /**
  //    * 获取首页商铺列表
  //    */
  //   var _this = this;
  //   var page = _this.data.page;
  //   var argu = {
  //     lat: app.globalData.cityData.lat,
  //     lng: app.globalData.cityData.lng,
  //     type: 2, //店铺分类
  //     shopCity: app.globalData.cityData.cityName,
  //     shopArea: this.data.shopArea,
  //     shopTown: this.data.shopTown,
  //     industry: this.data.industry,
  //     sortType: this.data.sortType,
  //     shopFwTypes: this.data.shopFwTypes,
  //     page: ++page,
  //   }
  //   getStoreList(argu).then((res) => {
  //     if (res.data) {
  //       _this.setData({
  //         storeList: res.data,
  //         count: res.data.count || 1,
  //         page: page
  //       })
  //     } else {
  //       wx.showToast({
  //         title: '全部加载完成',
  //         icon: 'loading',
  //         duration: 500
  //       })
  //     }
  //   })
  // },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    this.getIndexShop();
    wx.hideNavigationBarLoading(); //完成停止加载图标
    wx.stopPullDownRefresh();
  }
});