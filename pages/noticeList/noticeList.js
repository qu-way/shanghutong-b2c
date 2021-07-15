import {getNotice} from '../../api/index.js';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      noticeList:[]
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function () {
      getNotice(3).then((res) => {
         if(res.code===200) {
           this.setData({
            noticeList:res.data
           })
         }
       })
   }
})