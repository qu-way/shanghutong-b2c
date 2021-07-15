import request from "./../utils/request.js";
/**
 * 添加收货地址
 * @param object argu
 * 
*/
export function addUserAddress(argu){
   return request.post('user/address/add',argu)
 }

 /**
 * 编辑收货地址
 * @param object argu
 * 
*/
export function editUserAddress(argu){
   return request.post('user/address/edit',argu)
 }

/**
 * 获取收货地址
 * @param object argu
 * 
*/
export function getUserAddress(argu){
   return request.post('user/address/getUserAddress',argu)
 }

 /**
 * 删除收货地址
 * @param object argu
 * 
*/
export function delUserAddress(argu){
  return request.post('user/address/remove',argu)
}