import { getCollegeAll } from '../../api/college.js';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      collegeList:[],
      categoryName:"",
      active:0
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (e) {
      let argu = {
         type:3,
         videoType:1,
         categoryName:e.categoryName
      }
      getCollegeAll(argu).then((res) => {
         this.setData({
            collegeList:res.data
         })
      })
   },

   goDetail:function(e) {
      console.log(e)
      wx.navigateTo({
        url: '/pages/video/video?id=' + e.currentTarget.dataset.id,
      })
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   }
})