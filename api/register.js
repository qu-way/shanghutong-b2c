import request from "../utils/request.js";
/**
 * 获取Session
 * @param object data
*/
export function getSession(argu) {
  return request.post('miniProgram/getSession', argu,{noAuth:true})
}
/**
 * 微信手机号等信息解密
 * @param object data
*/
export function getDecrypt(argu) {
  return request.post('miniProgram/decrypt', argu,{noAuth:true})
}

/**
 * 判断是否注册
 * @param object data
*/
export function isRegister(argu) {
   return request.post('miniProgram/isExistPhone',argu,{noAuth:true})
 }

 /**
 * 去注册
 * @param object data
*/
export function goRegister(argu) {
   return request.post('miniProgram/register',argu,{noAuth:true})
 }

