import request from "./../utils/request.js";

/**
 * 获取默认地址详情
 * @param object argu
 * 
*/
export function getAddressDetails(argu){
  return request.post('user/address/searchAddress',argu)
}

/**
 * 创建购买订单
 * @param object argu
 * 
*/
export function submitOrder(argu){
   return request.post('orderSales/buy',argu)
 }

 /**
 * 线下买单
 * @param object argu
 * 
*/
export function offlinePayment(argu){
  return request.post('offlinePaymentRecord/buy',argu)
}

 /**
 * 立即支付
 * @param object argu
 * 
*/
export function rightOffPay(argu){
  return request.post('orderSales/orderPay',argu,{noAuth: true})
}

 /**
 * 我的钱包
 * @param object argu
 * 
*/
export function getWallet(){
  return request.post('userWallet/myWallet')
}
