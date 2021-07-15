import {getGoodsComment} from '../../api/api'
var app = getApp();
Page({
  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 我的评价的页码
     */
    page:1,
    // 星星数量
    starArr: '',
    /**
     * 我的评价的数量
     */
    count:0,
    /**
     * 我的评价的数据
     */
    commentList:[],
    goodsId:0,
    type:1,
  },

  onLoad(options){
    this.initData(options);
  },

  initData(options){
    /**
     * 获取用户评价列表
     */
    var argu = {
      goodsId:options.goodsId
    }
    getGoodsComment(argu).then((res)=>{
      if(res){
        this.setData({
          commentList:res.data
        })
      }
    }).catch((res)=>{
      wx.showToast({
        title: res.msg,
        icon: 'error',
        duration: 500
      })
    })
  }
})