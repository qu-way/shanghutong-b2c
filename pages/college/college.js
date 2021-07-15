import { getCollege } from '../../api/college.js';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      collegeData:[]
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      let argu = {
         type:3
      }
      getCollege(argu).then((res) => {
         this.setData({
            collegeData:res.data
         })
         console.log(this.data.collegeData)
      })
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   }
})