import request from "./../utils/request.js";
/**
 * 公共接口 ，优惠券接口 , 开放城市 , 手机号码注册,商品评价
 * 
*/
/**
 * 获取开放城市列表
 * @param object data
*/
export function getOpenCity(argu) {
  return request.post('position/openCityList', argu,{noAuth:true})
}
/**
 * 获取商品评价
 * @param object data
*/
export function getGoodsComment(argu) {
  return request.post('orderSalesComment/getGoodsSalesComment',argu,{noAuth:true})
}
/**
 * 查询商品与店铺
 * @param object data
*/
export function searchGoodStore(argu) {
  return request.post('merchantGoods/searchGoodsAndStore',argu,{noAuth:true})
}

/**
 * 搜索店铺里的商品
 * @param object data
*/
export function getStoreSearch(argu) {
  return request.post('merchantGoods/searchStore',argu,{noAuth:true})
}

/**
 * 获取字典数据
 * @param object data
*/
export function getDictData(argu) {
  return request.post('dictData/list',argu,{noAuth:true})
}
