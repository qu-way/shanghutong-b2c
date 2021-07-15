import { getShopList,deleteCartList,putNumber} from '../../api/cart'
var app = getApp();
Page({
  data: {
    cartsList: [],
    checkedList: [],
    editState: false,
    isLogin: false,
    shopChecked: false,
    allGoodsChecked: false,
    allGoodsNums: 0,
    goodsNums: 0,
    totalPrice: 0,
    toOrderList:[]
  },
  // onLoad() {

  // },
  onShow: function () {
    let token = app.globalData.token;
    let cartList = this.data.cartsList;
    this.setData({
      isLogin: token ? true : false,
    })
    for (var i = 0; i < cartList.length; i++) {
      cartList.splice(i, cartList.length)
    }
    this.getShopCartList();
  },

  // 处理获取到的数据
  getShopCartList: function () {
    var cartsList = this.data.cartsList;
    getShopList().then((res) => {
      let cartList = res.data
      let goodData = [];
      if (res.code == 200) {
        for (let i = 0; i < cartList.length; i++) {
          if (goodData.indexOf(cartList[i].storeId) === -1) {
            cartsList.push({
              storeId: cartList[i].storeId,
              storeName: cartList[i].storeName,
              goodsList: [cartList[i]]
            });
            goodData.push(cartList[i].storeId);
          } else {
            for (let j = 0; j < cartsList.length; j++) {
              if (cartsList[j].storeId == cartList[i].storeId) {
                cartsList[j].goodsList.push(cartList[i]);
                break;
              }
            }
          }
        }
      } else {
        return false
      }
      this.setData({
        cartsList
      })
      console.log(this.data.cartsList)
      this.handleFilterCheckedGoods();
    })
  },

  // 权限判断
  handelAuth() {
    if (this.data.isLogin) {
      wx.switchTab({
        url: '../index/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 切换编辑选中状态
  handleChangeEditState() {
    const editState = !this.data.editState
    this.setData({
      editState,
    })
  },
  // 根据编辑状态操作商品
  handleOperateGoods() {
    if (this.data.editState) {
      this.handleRemoveGoods() //去删除
    } else {
      this.handleChooseGoods() //去结算
    }
  },
  // 编辑状态下删除商品
  handleRemoveGoods() {
    var cartList = this.data.cartsList;
    var deleed = [];
    var index = -1;
    var denum = 0;
    var car = 0;
    var item = '';
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].shopChecked == true) {
        car = i
      }
      var goodsList = cartList[i].goodsList;
      for (var j = 0; j < goodsList.length; j++) {
        if (goodsList[j].checked) {
          item += goodsList[j].id +',';
          deleed.push(goodsList[j])
          if (index == -1) {
            index = j
          }
          denum++
        }
      }
    }
    wx.showModal({
      title: '提示',
      content: '是否确认删除？',
      success: (res) => {
        if (res.confirm) {
          console.log(item);
          console.log(deleed);
          let argu = {
            ids:item
          }
          deleteCartList(argu).then((item) => {})
          cartList.forEach(v => {
            console.log(deleed.length);
            console.log(v.goodsList.length);
            if (v.goodsList.length == deleed.length) {
              cartList.splice(car, 1)
              console.log(v.goodsList.length);
            } else {
              v.goodsList.splice(index, denum)
              setTimeout(() => {
                console.log(v.goodsList.length);
                if (v.goodsList.length == 0) {
                  this.setData({
                    cartsList: []
                  })
                }
              }, 10);
            }
          })
          console.log(cartList);
          this.setData({
            cartsList: cartList
          })
          this.handleFilterCheckedGoods();
        }
      }
    })
  },
  handleChooseGoods() {
    let cartList = this.data.cartsList;
    var newarr=[];
    cartList.forEach(item => {
      for (let i = 0; i < item.goodsList.length; i++) {
        if (item.goodsList[i].checked !== true) {
          item.goodsList.splice(item.goodsList[i], 1)
          console.log(this.data.cartsList)
          console.log(this.data.cartList)
        }
      }
      if(item.shopChecked ==true ){
        newarr.push(item);
        console.log(newarr)
    }
  })
    console.log(cartList)
    console.log(newarr)
    wx.setStorageSync('order', newarr)
    wx.navigateTo({
      url: '/pages/pays/pays'
    });
  },
  // 选择商品
  handleChangeGoods: function (e) {
    console.log(e)
    // var cartList = this.data.cartsList;
    // var index = e.currentTarget.dataset.index;
    // var inx = e.currentTarget.dataset.selectIndex;
    // var ie = cartList[inx]
    // var goodst = cartList[inx].goodsList;
    // // if( ie.)
    // var cuart = goodst[index];
    // if (cuart.checked) {
    //   cartList[inx].goodsList[index].checked = false;
    //   cartList[inx].shopChecked = false;
    // } else {
    //   cartList[inx].goodsList[index].checked = true;
    //   var stareleg = cartList[inx].goodsList.length;
    //   var goodsList = cartList[inx].goodsList;
    //   var selected = 0;
    //   for (var i in goodsList) {
    //     if (goodsList[i].checked === true) {
    //       selected++
    //     }
    //   }
    //   if (stareleg == selected) {
    //     cartList[inx].shopChecked = true;
    //   }
    // }
    // this.setData({
    //   cartsList: cartList
    // })
    var cartList = this.data.cartsList;
    var temporaryList = []
    console.log(cartList)
    let index = e.currentTarget.dataset.index;//商品
    let inx = e.currentTarget.dataset.selectIndex;//店
    let itemStore = cartList[inx]
    let itemGoods = cartList[inx].goodsList[index];
    let goodArt = cartList[inx].goodsList[index];
    console.log(this.data.cartsList)
    if (goodArt.checked) {
      cartList[inx].goodsList[index].checked = false;
      cartList[inx].shopChecked = false;
    } else {
      itemStore.shopChecked = true
      itemGoods.checked = true;
      var stareleg = cartList[inx].goodsList.length;
      var goodsList = cartList[inx].goodsList;
      var selected = 0;
      for (var i in goodsList) {
        if (goodsList[i].checked === true) {
          selected++
        }
      }
      if (stareleg == selected) {
        cartList[inx].shopChecked = true;
      }
    }
    this.setData({
        cartsList: cartList
      })
    this.handleFilterCheckedGoods();
    this.allPrices();
  },
  // 全选店铺商品
  handleChangeShopGoods: function (e) {
    var cartList = this.data.cartsList;
    var index = e.currentTarget.dataset.index;
    var thisgoodsList = cartList[index].goodsList;
    if (cartList[index].shopChecked) {
      cartList[index].shopChecked = false;
      for (var i in thisgoodsList) {
        cartList[index].goodsList[i].checked = false;
      }
    } else {
      cartList[index].shopChecked = true;
      for (var i in thisgoodsList) {
        cartList[index].goodsList[i].checked = true
      }
    }
    this.setData({
      cartsList: cartList,
    })
    this.handleFilterCheckedGoods();
    this.allPrices();
  },
  // 全选所有商品
  handleChooseAllShopGoods: function () {
    var allGoodsChecked = this.data.allGoodsChecked;
    var cartList = this.data.cartsList;
    if (allGoodsChecked) {
      allGoodsChecked = false;
    } else {
      allGoodsChecked = true;
    }
    for (var i = 0; i < cartList.length; i++) {
      cartList[i].shopChecked = allGoodsChecked
      var goodsList = cartList[i].goodsList;
      for (var a = 0; a < goodsList.length; a++) {
        goodsList[a].checked = allGoodsChecked
      }
    }
    this.setData({
      cartsList: cartList,
      allGoodsChecked: allGoodsChecked
    })
    this.handleFilterCheckedGoods()
  },

  // 筛选已勾选的商品并进行商品总数,总价和购物车商品总数量计算
  handleFilterCheckedGoods() {
    var cartList = this.data.cartsList;
    var allGoodsNums = 0;
    var totalPrice = 0;
    var goodsNums = 0;
    let cartListed = cartList;
    const checkedList = [];
    for (var i = 0; i < cartListed.length; i++) {
      var goodsList = cartListed[i].goodsList;
      for (var a = 0; a < goodsList.length; a++) {
        if (goodsList[a].checked) {
          checkedList.push(goodsList[a])
        }
      }
    }
    for (var i = 0; i < checkedList.length; i++) {
      totalPrice += checkedList[i].price * checkedList[i].buyNum;
      goodsNums += checkedList[i].buyNum;
    }
    cartListed.forEach(v => {
      allGoodsNums += v.goodsList.length;
    })
    this.setData({
      cartsList: cartList,
      checkedList,
      goodsNums,
      totalPrice,
      allGoodsNums
    })
  },
  //  全选条件 条件=>商铺全选择全选反之
  allPrices: function () {
    var cartList = this.data.cartsList;
    var storenum = cartList.length;
    var allGoodsChecked = this.data.allGoodsChecked;
    var allseletednum = 0;
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].shopChecked == true) {
        allseletednum++
      }
    }
    if (storenum == allseletednum) {
      allGoodsChecked = true;
    } else {
      allGoodsChecked = false;
    }
    this.setData({
      allGoodsChecked: allGoodsChecked
    })
    this.handleFilterCheckedGoods();
  },
  // 点击+号
  handleminusEditGoodsNums(e) {
    var index = e.currentTarget.dataset.index;
    var inx = e.currentTarget.dataset.selectIndex;
    var cartList = this.data.cartsList;
    var item = cartList[inx].goodsList[index];
    var num = item.buyNum + 1;
    cartList[inx].goodsList[index].buyNum = num;
    cartList[inx].goodsList[index].quantity = num;
    let goodId = cartList[inx].goodsList[index].id
    var data = {
      id: goodId,
      num
    }
    putNumber(data).then((data) => {});
    this.handleFilterCheckedGoods();
    this.setData({
      cartsList: cartList,
    })
  },
  // 点击-号
  handleaddEditGoodsNums(e) {
    var index = e.currentTarget.dataset.index;
    var inx = e.currentTarget.dataset.selectIndex;
    var cartList = this.data.cartsList;
    console.log(cartList)
    var item = cartList[inx].goodsList[index];
    var num = item.buyNum - 1;
    if (item.buyNum <= 1) {
      wx.showToast({
        title: '商品数量不能小于1哦！',
        icon: 'none',
      })
      return false
    }
    cartList[inx].goodsList[index].buyNum = num;
    cartList[inx].goodsList[index].quantity = num;
    let goodId = cartList[inx].goodsList[index].id
    var data = {
      id: goodId,
      num
    }
    putNumber(data).then((data) => {});
    this.handleFilterCheckedGoods();
    this.setData({
      cartsList: cartList
    })
  }
})