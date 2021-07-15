import request from "../utils/request.js";

/**
 * 获取商学院菜单
 * @param int id
 * 
*/
export function getCollege(argu){
  return request.get('businessSchool/query',argu,{noAuth:true})
}


/**
 * 获取商学院媒体详情
 * @param int argu
 * 
*/
export function getCollegeDeta(argu){
  return request.get('businessSchool/query/id',argu,{noAuth:true})
}

/**
 * 获取商学院所有详情
 * @param int argu
 * 
*/
export function getCollegeAll(argu){
  return request.get('businessSchool/query/all',argu,{noAuth:true})
}

