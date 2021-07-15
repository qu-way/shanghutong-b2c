import { getCollegeDeta } from '../../api/college.js';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      vMedia:[]
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log(options)
      let argu = {
         id:options.id
      }
      getCollegeDeta(argu).then((res) => {
         this.setData({
            vMedia:res.data
         })
      })
   }

})