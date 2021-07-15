import request from "./../utils/request.js";

/**
 * 获取个人中心优惠券
 * @param int id
 * 
*/
export function getUserCoupon(){
  return request.post('user/coupon/couponlist')
}

/**
 * 获取个人商品收藏
 *
 * 
*/
export function getCollection(){
  return request.post('user/getgoods')
}

/**
 * 获取个人关注店铺
*/
export function getShopFollow(){
  return request.post('user/getshop')
}

/**
 * 获取个人关注店铺
*/
export function userEdit(argu){
  return request.post('user/edit/userInfo',argu)
}
