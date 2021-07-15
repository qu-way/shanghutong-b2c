import {
  getStoreList,
  getIndustry,
  searchAddressCity
} from '../../api/storeList'
const app = getApp()

Page({
  data: {
    region: { //骨架屏区域
      header: true,
      lists: true
    },
    showSkeleton: true,
    dropDownMenuTitle: ['区域', '品类', '综合排序', '筛选'],
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
    // 行业分类列表
    industryList: [],
    //根据城市查询地址列表
    addressList: [],
    windowHeight: app.globalData.windowHeight,
    // URL: URL,
    near: app.near,
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    /**
     * 是否在搜索状态
     */
    searchBool: false,
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
    /**
     * 商家列表
     */
    storeList: [{
        id: "",
        storeName: "",
        logoUrl: "",
        distance: ""
      },
      {
        id: "",
        storeName: "",
        logoUrl: "",
        distance: ""
      }
    ],
    //菜单id
    mainCategoryId: "",
    mainTitle: "",
    cityName: ''
  },
  onLoad(e) {
    console.log(e)
    wx.setNavigationBarTitle({
      title: e.menuType
    });
    var cityName = wx.getStorageSync('cityName')
    this.setData({
      mainCategoryId: e.mainCategoryId,
      mainTitle: e.menuType,
      cityName: cityName
    })
    this.initData(e);
    let that = this
    that.industry(e);
    that.addressList()
  },
  onShow() {
    setTimeout(() => {
      this.setData({
        'region.header': false,
        'region.lists': false
      })
    }, 400)
  },

  /**
   * 获取菜单分类数据
   */
  initData: function (e) {
    console.log(e)
    var _this = this;
    var argu = {
      lat: app.globalData.cityData.lat,
      lng: app.globalData.cityData.lng,
      type: 2, //店铺分类
      shopCity: this.data.cityName,
      shopArea: this.data.shopArea,
      shopTown: this.data.shopTown,
      industry: this.data.industry,
      sortType: this.data.sortType,
      shopFwTypes: this.data.shopFwTypes,
      mainCategoryId: this.data.mainCategoryId
    }
    getStoreList(argu).then((res) => {
      _this.setData({
        storeList: res.data,
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
  addressList() {
    let argu = {
      cityName: this.data.cityName
    }
    searchAddressCity(argu).then((res) => {
      console.log(res)
      let addressleft = res.data[0].addressDistricts;
      this.setData({
        addressList: addressleft
      });
    })
  },

  /**
   * 跳转页面
   */
  goLink: function (event) {
    let url = event.currentTarget.dataset.link;
    url && wx.navigateTo({
      url
    })
  },
  /**
   * 页面下拉触底事件
   */
  // onReachBottom() {
  //   this.nextPage();
  // },

  indexScrollTo(e) {
    console.log(e)
    wx.pageScrollTo({
      scrollTop: e.target.offsetTop - 1,
      duration: 300
    })
  },
  /**
   * 导航到商家主页
   */
  toShop(e) {
    app.current.storeId = e.currentTarget.dataset.storeId;
    app.current.storeName = e.currentTarget.dataset.storeName;
    wx.navigateTo({
      url: '../shop/shop?storeId=' + e.currentTarget.dataset.storeId + '&storeName=' + e.currentTarget.dataset.storeName
    })
  },
  // 总筛选
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
    if (e.detail.index === "3") {
      let selectedTitle = e.detail.selectedTitle;
      if (selectedTitle === '距离最近') {
        this.setData({
          sortType: 0
        })
      }
      if (selectedTitle === '评分最高') {
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
    this.initData();
  },

  // next() {
  //   if (this.data.searchBool) {
  //     this.nextSearchPage();
  //   } else {
  //     this.nextPage();
  //   }
  // },
  /**
   * 下一頁,重新获取首页数据
   */
  // nextPage() {
  //   var _this = this;
  //   var page = _this.data.page;
  //   var argu = {
  //     lat: app.globalData.cityData.lat,
  //     lng: app.globalData.cityData.lng,
  //     type: 2, //店铺分类
  //     cityName: app.globalData.cityData.cityName,
  //     page: ++page
  //   }
  //   getStoreList(argu).then((data) => {
  //     if (data) {
  //       _this.setData({
  //         storeList: data,
  //         count: data.count || 1,
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
  // onPullDownRefresh: function () {
  //   wx.showNavigationBarLoading(); //在标题栏中显示加载图标
  //   // this.getIndexShop();
  //   wx.hideNavigationBarLoading(); //完成停止加载图标
  //   wx.stopPullDownRefresh();
  // }
});