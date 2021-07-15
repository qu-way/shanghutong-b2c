import request from "./../utils/request.js";

/**
 * 用户订单以及币优惠券数量
 * 
 */
export function getNumInfo() {
  return request.post('orderSales/buyerNumInfo', {}, {
    noAuth: false
  });
}

/**
 * 通过token获取当前登录人信息
 * 
 */
export function getUserInformation() {
  return request.post('user/account/getCurrentUserInfo');
}

/**
 * 上传图像
 * @param int argu
*/
export function uploadFile(argu){
  return request.get('oss/uploadFileList',argu)
}