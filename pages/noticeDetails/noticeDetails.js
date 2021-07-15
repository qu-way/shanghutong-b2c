import {getNotice} from '../../api/index.js';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      noticeData:"",
      noticeTitle:""
   },

   onLoad: function (e) {
      console.log(e)
      getNotice(3).then((res) => {
         if(res.code===200) {
           let detailData = res.data
           for ( let i = 0; i<detailData.length; i++ ) {
              console.log(e.id);
              console.log(detailData[0].id);
               if(e.id === detailData[i].id ) {
                  this.setData({
                     noticeData:detailData[i].noticeContent,
                     noticeTitle: detailData[i].noticeTitle
                  })
               }
           }
         }
       })
   }

})