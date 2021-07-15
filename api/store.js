import request from "./../utils/request.js";

/**
 * 获取推荐产品
 * 
 */
export function getProductHot(page,limit) {
  return request.get("product/hot", { 
    page: page === undefined ? 1 : page, 
    limit:limit === undefined ? 4 :limit
  },{noAuth:true});
}


/**
 * 获取分类列表
 * @param object data
*/
export function getCategoryList(argu) {
  return request.post('storeCategory/getCategory', argu,{noAuth:true})
}

/**
 * 获取分类商品
 * @param object data
*/
export function getMerchantGoods(argu) {
  return request.post('merchantGoods/getMerchantGoods', argu,{noAuth:true})
}

/**
 * 获取店铺信息
 * @param object data
*/
export function getStoreInfo(argu) {
  return request.post('storeInfo/getBannerByStoreId', argu,{noAuth:true})
}

/**
 * 获取店铺优惠券
 * @param object data
*/
export function getStoreCoupon(argu) {
  return request.post('user/discount/coupon/small-routine', argu,{noAuth:true})
}

/**
 * 领取优惠券
 * @param object data
*/
export function receiveCoupon(argu) {
  return request.post('user/coupon/receive', argu)
}

/**
 * 查询关注/收藏
 * @param object data
*/
export function searchCollection(argu) {
  return request.post('user/collection', argu)
}

/**
 * 获取店铺详细信息
 * @param object data
*/
export function getStoreInfoDetails(argu) {
  return request.post('storeInfo/getStoreInfoDetails', argu,{noAuth:true})
}

/**
 * 添加店铺关注
 * @param object data
*/
export function addCollection(argu) {
  return request.post('user/collection/insert', argu)
}

/**
 * 取消店铺关注
 * @param object data
*/
export function cancelCollection(argu) {
  return request.post('user/collecton/cancel', argu)
}