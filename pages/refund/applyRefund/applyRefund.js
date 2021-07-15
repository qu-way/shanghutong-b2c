import { postOrderSonDetails,submitRefund } from '../../../api/order.js';
import { getDictData } from '../../../api/api';
import { HTTP_REQUEST_URL} from '../../../config.js';
Page({
  data:{
    show: false,
    temp: [],
    totalMoney: 0,
    // orderDetails: [],
    //上传图片
    goodsId:"",
    goodsName:"",
    goodsCover:"",
    storeName:"",
    storeId:"",
    fileList: [],
    vState: {
			name: "请选择货物状态",
			value: 0
		},
		vReason: {
			name: "请选择退款原因",
			value: 0
		},
		vAmount: {
			name: "可输入备注要求",
			value: "0"
    },
    state: false,
    reason: false,
    money: false,
    goodsStatus:[],
    refundReson:[],
    stateRadio: '',
    reasonRadio: '',
    reInstruction:"",
    orderId:"",
    payPrice:"",//实际支付价格
    retailPrice:"",//零售价格
    refundedPrice:"",//退款价格
    quantity:0
  },
  onLoad: function(id) {
    console.log(id)
    this.refund(id)
    this.dictData()
  },
// 订单详情
  refund:function(id) {
    postOrderSonDetails(id).then((res) => {
      console.log(res.data)
      this.setData({
        goodsId:res.data.goods.id,
        goodsName:res.data.goods.name,
        goodsCover:res.data.goods.cover,
        storeName:res.data.storeInfo.storeName,
        storeId: res.data.storeInfo.id,
        payPrice:res.data.payPrice,//实际支付价格
        retailPrice: res.data.retailPrice,//零售价格
        refundedPrice: res.data.payPrice,//退款价格
        quantity: res.data.quantity,
        vAmount: {
          name: res.data.payPrice,
          value: "¥1"
        },
        orderId:res.data.orderSalesId,
        orderItemId: res.data.id,
      })
  })
},
// 字典数据
dictData:function() {
  let arg = {
      "dictType": "refund_goods_status"
  }
  getDictData(arg).then((res) => {
    this.setData({
      goodsStatus:res.data
    })
  })
  let argu = {
    "dictType":"refund_reson_option"
  }
  getDictData(argu).then((res) => {
    this.setData({
      refundReson:res.data
    })
  })
},
openState:function() {
  this.setData({
    state:true
  })
},
openReason:function() {
  this.setData({
    reason:true
  })
},

close:function() {
  this.setData({
    state:false,
    reason:false
  })
},

selectState: function (e) {
  console.log(e)
  let label = e.currentTarget.dataset.dicLabel
  let value = e.currentTarget.dataset.dictValue
  this.setData({
    vState: {
      name: label,
      value: value
    }
  });
},

// stateChange(event) {
//   console.log(event)
//   this.setData({
//     stateRadio: event.detail,
//   });
// },

stateClick(e) {
  console.log(e)
  let label = e.currentTarget.dataset.dicLabel
  let value = e.currentTarget.dataset.dictValue
  this.setData({
    stateRadio: value,
    vState: {
      name: label,
      value: value
    }
  });
},

reasonClick(e) {
  console.log(e)
  let label = e.currentTarget.dataset.name
  let value = e.currentTarget.dataset.value
  this.setData({
    reasonRadio: value,
    vReason: {
      name: label,
      value: value
    }
  });
},


// reasonChange(event) {
//   console.log(event)
//   this.setData({
//     reasonRadio: event.detail,
//   });
// },



reInstruc:function(e) {
  console.log(e)
  let title = e.detail.value;
  this.setData({
    reInstruction:title
  });
},
  //选择图片
  afterRead(event) {
    console.log(event)
    const { file } = event.detail;
    var that = this
    console.log(file)
   var token = getApp().globalData.token
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: HTTP_REQUEST_URL + "/shanghutong-system/oss/uploadFileList", // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: "file",
        formData: {
          'file': "file"
        },
        header: {
          "Content-Type": "multipart/form-data",
          "Authorization": token
        },
      success(res) {
        // 上传完成需要更新 fileList
        // const fileList = [];
        console.log(res)
        const { fileList = [] } = that.data;
        var data = res.data ? JSON.parse(res.data) : {};
        console.log(data)
        fileList.push({ url:data.data.url});
        that.setData({ fileList });
        console.log(fileList)
      },
    });
  },
  beforeDelete:function(e) {
    var fileList = this.data.fileList;
    let elIndex = e.detail.index
    fileList.splice(elIndex, 1)
    this.setData({
      fileList
    })
  },
  //选择图片
  // choosePic: function () {
  //   var that = this;
  //   if (this.data.imgPath == '../../img/pic.png') {
  //     wx.chooseImage({
  //       count: 3,
  //       sizeType: ['original', 'compressed'],
  //       sourceType: ['album', 'camera'],
  //       success: function (res) {
  //         var len = res.tempFilePaths.length;
  //         var temp = [that.data.imgPath2, that.data.imgPath3, that.data.imgPath];
  //         if (that.data.imgLen == 0) {
  //           for (var i = 0; i < len; i++) {
  //             temp[i] = res.tempFilePaths[i];
  //           }
  //         } else {
  //           for (var i = that.data.imgLen, j = 0; j < len && i < 3; i++ , j++) {
  //             temp[i] = res.tempFilePaths[j];
  //             console.log(temp)
  //           }
  //         }
  //         var len2 = len + that.data.imgLen;
  //         if (len2 > 3) {
  //           len2 = 3;
  //         }
  //         that.setData({
  //           imgLen: len2,
  //           temp: temp,
  //           imgPath2: temp[0],
  //           imgPath3: temp[1],
  //           imgPath: temp[2],
  //         });
  //       }
  //     })
  //   }
  // },
  // del: function (e) {
  //   var i = e.currentTarget.dataset.id;
  //   if (i == 0) {
  //     if (this.data.imgPath != '../../img/pic.png') {
  //       this.setData({
  //         imgPath2: this.data.imgPath3,
  //         imgPath3: this.data.imgPath,
  //         imgPath: '../../img/pic.png',
  //         imgLen: this.data.imgLen - 1
  //       })
  //     } else {
  //       this.setData({
  //         imgPath2: this.data.imgPath3,
  //         imgPath3: '',
  //         // imgPath2: '',
  //         imgLen: this.data.imgLen - 1
  //       })
  //     }
  //   } else if (i == 1) {
  //     if (this.data.imgPath != '../../img/pic.png') {
  //       this.setData({
  //         imgPath3: this.data.imgPath,
  //         imgPath: '../../img/pic.png',
  //         imgLen: this.data.imgLen - 1
  //       })
  //     } else {
  //       this.setData({
  //         imgPath3: '',
  //         imgLen: this.data.imgLen - 1
  //       })
  //     }
  //   } else if (i == 2) {
  //     this.setData({
  //       imgPath: '../../img/pic.png',
  //       imgLen: this.data.imgLen - 1
  //     })
  //   }
  // },
  toSubmit: function(e) {
    console.log(e)
    let fileList = this.data.fileList;
    var fileArr = [];
    if (fileList != null && fileList.length != 0) {
        for (var i = 0; i < fileList.length; i++) {
          fileArr.push(fileList[i].url);
        }
    }
    console.log(fileArr.toString())
    let argu = {
        type: 1,
        orderId: this.data.orderId,
        orderItemId: this.data.orderItemId,
        refundGoodsStatus: 1,
        reason: this.data.vReason.name,
        refundedPrice: this.data.refundedPrice,
        refundType: 3,
        refundRemark: this.data.reInstruction,
        imgs: fileArr.toString()
    }
    console.log(argu)
    submitRefund(argu).then((res) => {
      console.log(res)
    })
  }
})