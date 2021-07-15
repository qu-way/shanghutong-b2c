import request from "../utils/httpClient.js";
/**
 * 马上登录
 * @param object data
*/
export function goSignin(argu) {
   return request.post('getMiniProgramToken',argu,{noAuth:true})
 }