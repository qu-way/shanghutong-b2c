import { getOpenCity } from '../../api/api'
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
  data: {
    cityName: "",
    cityCode: "",
    openCityList: [],
  },
  onLoad: function () {
    var that = this;
    qqmapsdk = new QQMapWX({
      key: '3WEBZ-5TTW2-3WLUH-CW7ZE-MPCBF-GXFCC'
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //根据坐标获取当前位置名称,腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.address_component.city.slice(0, 2);
            that.setData({
              locationCity: address
            })
          }
        })
      }
    })
  },
  /**
   * 获取已开通城市
   */
  onReady: function () {
    getOpenCity().then((res) => {
        this.setData({
          openCityList: res.data,
        });
        let cityList = this.data.openCityList;
        var abc = []
        for( let i = 0; i< cityList.length; i++){
          var openCityName = cityList[i]["letter"]
          abc.push(openCityName)
        }
        this.setData({
          ocName:abc
        });
      })
  },

  //选择城市
  bindOpenCity: function (e) {
    let cityName = e.currentTarget.dataset.cityname;
    let cityCode = e.currentTarget.dataset.cityCode;
    this.setData({
      cityName,
      cityCode
    })
    this.updateAppCity(cityName);
    wx.setStorage({
      key:"cityName",
      data:cityName
    })
  },


  // 跳回首页城市参数
  updateAppCity(e) {
    console.log(e)
    app.globalData.cityData.cityName = e;
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})

