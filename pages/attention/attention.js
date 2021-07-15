import {getShopFollow} from '../../api/user'

var app = getApp();
Page({
    data: {
        goodsList: [],
        categoryFilter: false,
        currentSortType: 'default',
        filterCategory: [],
        categoryId: 0,
        lng:'',
        lat:''
    },
    onLoad: function (options) {
         var argu = {
            type: 2,
            lng: app.globalData.cityData.lng,
            lat: app.globalData.cityData.lat
         }
        getShopFollow(argu).then((res) => {
            if (res.code === 200) {
                this.setData({
                    goodsList: res.data
                });
            }
        });
    },
    toShop: function (e) {
        wx.navigateTo({
            url: "/pages/shop/shop?storeId="+e.currentTarget.dataset.storeId
          })
    }
})