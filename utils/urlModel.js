// const base = 'http://192.168.5.216:9001/';
const base = 'https://www.zcsht.cn/';
export var URL = {
  rootUrl: base + 'shanghutong-system/miniProgram/getSession', //
  openCity:base +'shanghutong-system/position/openCityList',//已开通的城市
  LIST_INDEX:base +'shanghutong-system/storeInfo/getStoreInfo', //获取用户信息
  goodsCategory: base +'shanghutong-system/goodsCategory/list',
  getSession:base + 'shanghutong-system/miniProgram/getSession?code=',
  decrypt:base + 'shanghutong-system/miniProgram/decrypt', //解密
  register:base + 'shanghutong-system/miniProgram/register', //注册
  signin:base + 'shanghutong-auth/getMiniProgramToken', //登陆
  isRegister: base + 'shanghutong-system/miniProgram/isExistPhone', //判断是否注册
  getStoreList:base + 'shanghutong-system/storeInfo/search',//获取首页商家,
  SHOP_CART_API:base + 'shanghutong-system/shoppingCart',//购物车
  storeInfo: base + 'shanghutong-system/storeInfo/getBannerByStoreId',//店铺信息
  categoryList:base + 'shanghutong-system/storeCategory/getCategory',//获取商品分类
  getMerchantGoods:base + 'shanghutong-system/merchantGoods/getMerchantGoods',//分类商品
  getUserAddress:base + 'shanghutong-system/user/address/getUserAddress', //获取用户地址列表
  addUserAddress:base + 'shanghutong-system/user/address/add', //添加用户收货地址
  editUserAddress:base + 'shanghutong-system/user/address/edit', //编辑用户收货地址
  getGoodsDetails:base + 'shanghutong-system/merchantGoods/getMerchantGoodsById', //获取商品详情
  postStoreShopping:base + 'shanghutong-system/shoppingCart/add', //添加购物车
  removeCart:base + 'shanghutong-system/shoppingCart/remove', //移除购物车商品
  getCollection: base + 'shanghutong-system/user/getgoods', //查询商品收藏
  getFollow: base + 'shanghutong-system/user/getshop', //获取关注店铺
  searchCollection: base + 'shanghutong-system/user/collection', //查询店铺关注
  addCollection: base + 'shanghutong-system/user/collection/insert', //添加个人收藏
  cancelCollection:base + 'shanghutong-system/user/collecton/cancel', //取消收藏
  getCartData: base + 'shanghutong-system/shoppingCart/chooseList', //购物车数据（计算购物车价格)
  searchGoodStore: base + 'shanghutong-system/merchantGoods/searchGoodsAndStore',//查询商品店铺
  getGoodsComment: base + 'shanghutong-system/orderSalesComment/getGoodsSalesComment', //获取商品评价
  getShopDetail: base + 'shanghutong-system/storeInfo/getMyShop', //获取店铺详情
  getStoreDetails: base + 'shanghutong-system/storeInfo/getStoreInfoDetails', //店铺详细
  submitOrder: base + 'shanghutong-system/orderSales/buy', //创建订单
  rightOffPay: base + 'shanghutong-system/orderSales/orderPay',//立即支付
  buyerNumInfo: base + 'shanghutong-system/orderSales/buyerNumInfo', //用户订单以及币优惠券数量
  storeSearch: base + 'shanghutong-system/merchantGoods/searchStore', //店内搜索
  getBannerList: base + 'shanghutong-system/banners/getBannerList', //获取banner图
  addressDetails: base + 'shanghutong-system/user/address/searchAddress', //根据地址ID查地址详情
  screenStore: base + 'shanghutong-system/storeInfo/search',//筛选首页店铺
  getIndustry: base + 'shanghutong-system/dictData/list', //获取行业数据
  searchAddressCity: base + 'shanghutong-system/addressCity/getStreet', //根据市查询所属区域以及街道
  getGridList: base + 'shanghutong-system/goodsCategory/merchantRecommendCategory', //获取宫格菜单数据
  getGoodsRecommend: base + 'shanghutong-system/merchantGoods/merchantGoodsRecommend', //推荐商品
  recommendEvaluate: base + 'shanghutong-system/merchantGoods/getGoodsSalesCommentRecommend', //推荐评价
  getGoodsSalesCommentRecommend: base + 'shanghutong-system/merchantGoods/getGoodsSalesCommentRecommend', //推荐评价
  couponList: base + 'shanghutong-system/user/discount/coupon/available', //获取可领取优惠券列表
  userCoupon: base + 'shanghutong-system/user/coupon/couponlist', //个人中心优惠券
  storeCoupon: base + 'shanghutong-system/user/discount/coupon/small-routine', //店铺优惠券
  receiveCoupon: base + 'shanghutong-system/user/coupon/receive', //领取优惠券
  getOrderList: base + 'shanghutong-system/orderSales/orderList', //获取我的订单列表
  cancelOrder: base + 'shanghutong-system/orderSales/cancelOrder', //取消订单
  orderDetails: base +'shanghutong-system/orderSales/buyerOrderDetail', //获取订单详情
  offlinePayment: base + 'shanghutong-system/offlinePaymentRecord/buy',//线下买单
}
