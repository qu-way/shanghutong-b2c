
import {
	loginNow
} from '../../utils/util';
const app = getApp();
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cateList:[],
    cartList: [],
    localList: [],
    
    viewTo: "",
    viewToLeft: "",
    listHeight: 300,
    activeIndex: 0,
    tabIndex: 0,
    showModal: false,
    showCart: false,
    heigthArr: [],
    cart: [],
    totalMoney: 0,
    activesInfo: {
      1: {
        class: "manjian",
        text: "减"
      },
      2: {
        class: "xindian",
        text: "新"
      },
      3: {
        class: "zhekou",
        text: "折"
      },
      4: {
        class: "daijinquan",
        text: "券"
      },
      5: {
        class: "xinyonghu",
        text: "新"
      },
      6: {
        class: "peisong",
        text: "配"
      },
      7: {
        class: "lingdaijin",
        text: "领"
      },
      8: {
        class: "zengsong",
        text: "赠"
      }
    },
    storeInfo: {
      //服务端获取信息
      storeId: 1,
      storeName: "竹林香米线",
      storeImgUrl: "/images/store.png",
      score: 4.4,
      saleMonth: 835,
      minDelPrice: 2,
      delPrice: 5,
      averagePrice: 15,
      delTime: 30,
      distance: 3.2,
      service: ["支持自取"],
      actives: [{
          activeId: 1,
          acticeText: "满20减10；满200减20；满1000减50；满1000减50；满1000减50"
        },
        {
          activeId: 2,
          acticeText: "本店新用户立减1元"
        },
        {
          activeId: 3,
          acticeText: "折扣商品9折起"
        }
      ],
      publicMsg: "欢迎光临本店,欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店"
    },
    cateList: [{
        titleId: "title1",
        title: "热销",
        foodCount: 0,
        items: [{
            foodId: 1,
            name: "糖醋里脊",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 2,
            name: "回锅肉",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 3,
            name: "东坡肉",
            price: 23,
            monthNum: 34,
            note: "味道很好,欢迎品尝",
            zan: 34,
            count: 0,
            classify: [{
                describe: "大份",
                price: 30
              },
              {
                describe: "中份",
                price: 23
              },
              {
                describe: "小份",
                price: 15
              }
            ]
          }
        ]
      },
      {
        titleId: "title2",
        title: "大菜",
        foodCount: 0,
        items: [{
            foodId: 4,
            name: "水煮牛肉",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 5,
            name: "红烧肉",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 6,
            name: "清蒸鱼",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: [{
                describe: "大份",
                price: 30
              },
              {
                describe: "中份",
                price: 23
              },
              {
                describe: "小份",
                price: 15
              }
            ]
          }
        ]
      },
      {
        titleId: "title3",
        title: "小菜",
        foodCount: 0,
        items: [{
            foodId: 7,
            name: "鱼香肉丝",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 8,
            name: "土豆丝",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 9,
            name: "拍黄瓜",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          }
        ]
      },
      {
        titleId: "title4",
        title: "饮料",
        foodCount: 0,
        items: [{
            foodId: 10,
            name: "可乐",
            price: 3,
            monthNum: 34,
            note: "",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 11,
            name: "雪碧",
            price: 3,
            monthNum: 34,
            note: "",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 12,
            name: "美年达",
            price: 3,
            monthNum: 34,
            note: "",
            zan: 34,
            count: 0,
            classify: []
          }
        ]
      },
      {
        titleId: "title5",
        title: "主食",
        foodCount: 0,
        items: [{
            foodId: 13,
            name: "馒头",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 14,
            name: "米饭",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 15,
            name: "煎饼",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: [{
                describe: "大份",
                price: 30
              },
              {
                describe: "中份",
                price: 23
              },
              {
                describe: "小份",
                price: 15
              }
            ]
          }
        ]
      },
      {
        titleId: "title6",
        title: "凉菜",
        foodCount: 0,
        items: [{
            foodId: 16,
            name: "馒头",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 17,
            name: "米饭",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 18,
            name: "煎饼",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: [{
                describe: "大份",
                price: 30
              },
              {
                describe: "中份",
                price: 23
              },
              {
                describe: "小份",
                price: 15
              }
            ]
          }
        ]
      },
      {
        titleId: "title7",
        title: "凉拌菜",
        foodCount: 0,
        items: [{
            foodId: 19,
            name: "馒头",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 20,
            name: "米饭",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 21,
            name: "煎饼",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: [{
                describe: "大份",
                price: 30
              },
              {
                describe: "中份",
                price: 23
              },
              {
                describe: "小份",
                price: 15
              }
            ]
          }
        ]
      },
      {
        titleId: "title8",
        title: "黄焖鸡",
        foodCount: 0,
        items: [{
            foodId: 22,
            name: "馒头",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 23,
            name: "米饭",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 24,
            name: "煎饼",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: [{
                describe: "大份",
                price: 30
              },
              {
                describe: "中份",
                price: 23
              },
              {
                describe: "小份",
                price: 15
              }
            ]
          }
        ]
      },
      {
        titleId: "title9",
        title: "糕点",
        foodCount: 0,
        items: [{
            foodId: 25,
            name: "馒头",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 26,
            name: "米饭",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 27,
            name: "煎饼",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: [{
                describe: "大份",
                price: 30
              },
              {
                describe: "中份",
                price: 23
              },
              {
                describe: "小份",
                price: 15
              }
            ]
          }
        ]
      },
      {
        titleId: "title10",
        title: "零食甜点",
        foodCount: 0,
        items: [{
            foodId: 28,
            name: "馒头",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 29,
            name: "米饭",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 30,
            name: "煎饼",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: [{
                describe: "大份",
                price: 30
              },
              {
                describe: "中份",
                price: 23
              },
              {
                describe: "小份",
                price: 15
              }
            ]
          }
        ]
      },
      {
        titleId: "title11",
        title: "美丽的鲜花",
        foodCount: 0,
        items: [{
            foodId: 31,
            name: "馒头",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 32,
            name: "米饭",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: []
          },
          {
            foodId: 33,
            name: "煎饼",
            price: 23,
            monthNum: 34,
            note: "狠辣",
            zan: 34,
            count: 0,
            classify: [{
                describe: "大份",
                price: 30
              },
              {
                describe: "中份",
                price: 23
              },
              {
                describe: "小份",
                price: 15
              }
            ]
          }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.storeInfo.storeName
    });
		var data = options
		httpClient.getCategoryList(data).then((data) => {
			if (data) {
				this.setData({
					cateList: data,
					storeName: app.current.storeName,
					storeId: options.storeId
				})
			} else {
				wx.showToast({
					title: '暂无分类',
					icon: 'loading',
					duration: 500
				})
			}
			var cateData = this.data.cateList;
			var first = {
				categoryId: cateData[0].id,
				storeId: cateData[0].storeId
      }
      console.log(this.data.cateList)
			httpClient.getMerchantGoods(first).then((data) => {
				this.setData({
					categoryId: cateData[0].id
				})
				var self = this;
				setTimeout(function () {
					self.setData({
						merchantGoods: data
					});
				}, 200);
			})
		})
		var res = wx.getStorageSync('orderList');
		if (res) {
			this.setData({
				cart: {
					count: res.count,
					total: res.total
				}
			});
			// if(!res.cartList)
			this.setData({
				cartList: res.cartList,
				localList: res.cartList
			})
		}
		if (typeof this.data.cartList[this.data.storeId] == 'undefined' || server.isEmptyObject(this.data.cartList[this.data.storeId])) {
			var cartList = this.data.cartList;
			cartList[this.data.storeId] = [];
			this.setData({
				cartList: cartList
			})
		}
		console.log(this.data.localList, this.data.cartList)
	},
  // onLoad: function (options) {
  //   wx.setNavigationBarTitle({
  //     title: this.data.storeInfo.storeName
  //   });
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let height1, height2;
    let res = wx.getSystemInfoSync();
    let winHeight = res.windowHeight;
    let query = wx.createSelectorQuery();
    query.select(".head").boundingClientRect();
    query.exec(res => {
      height1 = res[0].height;
      let query1 = wx.createSelectorQuery();
      query1.select(".tab").boundingClientRect();
      query1.exec(res => {
        height2 = res[0].height;
        this.setData({
          listHeight: winHeight - height1 - height2
        });
        this.calculateHeight();
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  selectFood(e) {
    // getMerchantGoods: function (e) {
      var category = e.currentTarget.dataset.id;
      var data = {
        storeId: e.currentTarget.dataset.storeId,
        categoryId: e.currentTarget.dataset.id
      }
      httpClient.getMerchantGoods(data).then((data) => {
        if (data) {
          this.setData({
            merchantGoods: data,
            categoryId: category,
          })
        }
        var self = this;
        setTimeout(function () {
          wx.pageScrollTo({
            scrollTop: 200,
            duration: 300
          });
          self.setData({
            merchantGoods: data
          });
        }, 100);
      })
      this.animaINit()
    // },
    this.setData({
      activeIndex: e.target.dataset.index,
      viewTo: e.target.dataset.titleid
    });
  },
  calculateHeight() {
    let heigthArr = [];
    let height = 0;
    heigthArr.push(height);
    var query = wx.createSelectorQuery();
    query.selectAll(".title-group").boundingClientRect();
    query.exec(res => {
      for (let i = 0; i < res[0].length; i++) {
        console.log(res[0][i])
        height += parseInt(res[0][i].height);
        heigthArr.push(height);
      }
      this.setData({
        heigthArr: heigthArr
      });
    });
  },
  // 手机端有延迟 节流函数效果不好 用防抖函数凑合
  scroll(e) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      let srollTop = e.detail.scrollTop;
      for (let i = 0; i < this.data.heigthArr.length; i++) {
        if (
          srollTop >= this.data.heigthArr[i] &&
          srollTop < this.data.heigthArr[i + 1] &&
          this.data.activeIndex != i
        ) {
          this.setData({
            activeIndex: i
          });
          if (i < 3) {
            this.setData({
              viewToLeft: 'title1left'
            })
          } else {
            this.setData({
              viewToLeft: 'title' + (i - 2) + 'left'
            })
          }
          return;
        }
      }
    }, 100)
  },
  add(e) {
    let groupindex = e.target.dataset.groupindex;
    let index = e.target.dataset.index;
    let countMsg ="food[" +groupindex +"].items[" + index + "].count";
    let count = this.data.food[groupindex].items[
      index
    ].count;
    let foodCountMsg = "food[" + groupindex + "].foodCount";
    let foodCount = this.data.food[groupindex].foodCount;
    let foodId = this.data.food[groupindex].items[
      index
    ].foodId;
    count += 1;
    foodCount += 1;
    this.setData({
      [countMsg]: count, //数据的局部更新
      [foodCountMsg]: foodCount
    });
    let cart = this.data.cart;
    let hasCart = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].foodId == foodId) {
        hasCart = true;
        break;
      }
    }
    if (hasCart) {
      cart[i].count++;
    } else {
      cart.push({ ...this.data.food[groupindex].items[index],
        groupindex
      });
    }
    let totalMoney = this.data.totalMoney;
    totalMoney += this.data.food[groupindex].items[
      index
    ].price;
    this.setData({
      cart: cart,
      totalMoney: totalMoney
    });
  },
  reduce(e) {
    let groupindex = e.target.dataset.groupindex;
    let index = e.target.dataset.index;
    let countMsg =
      "food[" +
      groupindex +
      "].items[" +
      index +
      "].count";
    let count = this.data.food[groupindex].items[
      index
    ].count;
    let foodCountMsg = "food[" + groupindex + "].foodCount";
    let foodCount = this.data.food[groupindex].foodCount;
    let foodId = this.data.food[groupindex].items[
      index
    ].foodId;
    count -= 1;
    foodCount -= 1;
    this.setData({
      [countMsg]: count,
      [foodCountMsg]: foodCount
    });
    let cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].foodId == foodId) {
        if (cart[i].count == 1) {
          cart.splice(i, 1);
        } else {
          cart[i].count--;
        }
        break;
      }
    }
    let totalMoney = this.data.totalMoney;
    totalMoney -= this.data.food[groupindex].items[
      index
    ].price;
    this.setData({
      cart: cart,
      totalMoney: totalMoney
    });
  },
  listCart() {
    if (this.data.cart.length > 0) {
      this.setData({
        showCart: !this.data.showCart
      })
    }
  },
  selectTabItem(e) {
    if (e.target.dataset.index) {
      this.setData({
        tabIndex: e.target.dataset.index
      });
    }
  },
  preventScrollSwiper() {
    return false;
  },
  showStoreDetail() {
    this.setData({
      showModal: true
    });
  },
  closeModal(e) {
    this.setData({
      showModal: false
    });
  }
});