import request from "./../utils/request.js";
/**
 * 获取个人中心订单列表
 * @param object data
*/
export function getOrderList(argu) {
  return request.post('orderSales/orderList', argu)
}
/**
 * 取消单笔订单
 * @param object data
*/
export function cancelOrder(argu) {
  return request.post('orderSales/cancelOrder', argu)
}

/**
 * 获取订单详情
 * @param object data
*/
export function getOrderDetails(argu) {
  return request.post('orderSales/buyerOrderDetail', argu)
}

/**
 * 取消单笔订单
 * @param object data
*/
export function getOrderLogistics(argu) {
  return request.post('logisticsRecord/info', argu)
}


/**
 * 物流查询
 * @param object data
*/
export function searchLogistics(argu) {
  return request.get('logisticsRecord/query/logistics', argu)
}

/**
 * 提交退款申请
 * @param object data
*/
export function submitRefund(argu) {
  return request.post('refund/apply', argu)
}

/**
 * 子订单详情
 * @param object data
*/
export function postOrderSonDetails(argu) {
  return request.post('orderSales/getOrderItemDetail', argu)
}

/**
 * 退款退货列表
 * @param object data
*/
export function postRefundList(argu) {
  return request.post('refund/buyerList', argu)
}

/**
 * 退款退货详情
 * @param object data
*/
export function postRefundDetail(argu) {
  return request.post('refund/getDetail', argu)
}

/**
 * 撤销退货退款申请
 * @param object data
*/
export function postRefundcancel(argu) {
  return request.post('refund/cancelApply', argu)
}
