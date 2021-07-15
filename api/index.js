import request from "./../utils/request.js";

/**
 * 获取banner图
 */
export function getBannerList(argu) {
   return request.post('banners/getBannerList',argu, {noAuth: true});
}

/**
 * 获取位置
 */
function getMap() {
   return new Promise((resove, reject) => {
      wx.getLocation({
         success: function (res) {
            resove(res);
         },
         fail: function (e) {
            reject(e);
         }
      })
   })
}
 
// 通过位置获取城市
export function getCity() {
   return new Promise((resove, reject) => {
      getMap().then((res) => {
         var argu = {
            ak: 'Fte9itT1uvgpjRGISh6tny2EnjhgDtYV',
            output: 'json',
            coordtype: 'wgs84ll',
            location: res.latitude + ',' + res.longitude
         }
         wx.request({
            url: 'https://api.map.baidu.com/reverse_geocoding/v3/',
            data: argu,
            success: function (res) {
               resove(res.data.result);
            },
            fail: function (e) {
               reject(e);
            }
         })
      })
   })
}

/**
 * 获取首页商家
 * @param int argu
 * 
*/
export function getStoreList(argu){
   return request.post('storeInfo/search',argu,{noAuth : true});
 }
 /**
 * 市查询所属区域以及街道
 * @param int argu
 * 
*/
export function searchAddressCity(argu){
   return request.post('addressCity/getStreet',argu,{noAuth : true});
 }

/**
 * 获取宫格菜单数据
 * @param int argu
*/
export function getGridList(argu){
   return request.post('goodsCategory/merchantRecommendCategory',argu,{noAuth : true});
 }

 /**
 * 获取行业数据
 * @param int argu
*/
export function getIndustry(argu){
   return request.post('dictData/list',argu,{noAuth : true});
 }

  /**
 * 获取通知公告数据
 * @param int argu
*/
 export function getNotice(types){
   return request.get('notice/getNotice/'+types)
 }
 


