import request from "./../utils/request.js";

/**
 * 获取商品详情
 * @param object data
*/
export function getGoodsDetails(argu) {
  return request.post('merchantGoods/getMerchantGoodsById', argu,{noAuth:true})
}

/**
 * 获取推荐商品
 * @param object data
*/
export function getGoodsRecommend(argu) {
  return request.post('merchantGoods/merchantGoodsRecommend', argu,{noAuth:true})
}

/**
 * 获取商品收藏
 * @param object data
*/
export function getCollection(argu) {
  return request.post('user/getgoods', argu,{noAuth:true})
}

/**
 * 获取推荐评价
 * @param object data
*/
export function getRecommendEvaluate(argu) {
  return request.post('merchantGoods/getGoodsSalesCommentRecommend', argu,{noAuth:true})
}

/**
 * 领取优惠券
 * @param object data
*/
export function receiveCoupon(argu) {
  return request.post('user/coupon/receive', argu)
}

/**
 * 添加个人收藏
 * @param object data
*/
export function addCollection(argu) {
   return request.post('user/collection/insert', argu)
 }

 /**
 * 取消商品收藏
 * @param object data
*/
export function cancelCollection(argu) {
   return request.post('user/collecton/cancel', argu)
 }

/**
 * 添加购物车
 * @param object data
*/
export function addShoppingCart(argu) {
   return request.post('shoppingCart/add', argu)
 }