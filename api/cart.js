import request from "./../utils/request.js";
/**
 * 获取购物车商品
 * @param token
*/
export function getShopList(){
   return request.post('shoppingCart/myList')
 }

 /**
 * 删除购物车商品
 * @param
*/
export function deleteCartList(argu){
   return request.post('shoppingCart/remove',argu)
 }

/**
 * 购物车商品加减
 * @param
*/
export function putNumber(argu){
   return request.post('shoppingCart/edit',argu)
 }

 /**
 * 购物车商品加
 * @param
*/
export function addShopToC(argu){
  return request.post('shoppingCart/add',argu)
}