import request from "./../utils/request.js";
/**
 * 九宫格菜单栏商家了列表
 * @param object data
*/
export function getStoreList(argu){
   return request.post('storeInfo/search',argu,{noAuth:true})
}

/**
 * 获取行业数据
 * @param object argu
*/
export function getIndustry(argu){
   return request.post('dictData/list',argu,{noAuth:true})
}

/**
 * 根据市查询所属区域以及街道
 * @param object argu
*/
export function searchAddressCity(argu){
   return request.post('addressCity/getStreet',argu,{noAuth:true})
}

/**
 * 根据市查询所属区域以及街道
 * @param object argu
*/
export function getListIndex(argu){
   return request.post('addressCity/getStreet',argu,{noAuth:true})
}