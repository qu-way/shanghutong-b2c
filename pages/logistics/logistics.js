import {
  searchLogistics,
  getOrderDetails,
  postOrderSonDetails
} from '../../api/order.js';
Page({
  data: {
    steps: [{
        text: '2020-10-12 15:00',
        desc: '[长沙市]岳麓区 快递员正在派件中',
      },
      {
        text: '2020-10-13 15:00',
        desc: '[长沙市]岳麓区集散中心 快递员已揽件',
      },
      {
        text: '2020-10-12 20:00',
        desc: '[长沙市]雨花区 集散中心已入库 下一站岳麓区集散中心',
      },
      {
        text: '2020-10-12 15:00',
        desc: '包裹正在等待揽收',
      },
    ],
    logisticsData: [],
    traceSteps: [],
    goodsCover:"",
    goodsName: "",
    goodsId: "",
    goodsPrice: "",
    storeName: "",
    quantity: "",
    goodsSpecificationName:""
  },
  onLoad: function (e) {
    this.orderDetails(e)
    console.log(e)
    //  let argu= {
    //   orderItemId: e.orderId
    //  }
    let argu = {
      orderItemId: "ca14fb4d-c4c1-4b1f-98bc-ca2382290e5a"
    }
    searchLogistics(argu).then((res) => {
      console.log(res.data.traces)
      this.setData({
        logisticsData: res.data,
        traceSteps: res.data.traces
      })
    })
  },
  orderDetails: function (e) {
    let argu = {
      id: e.orderId
    }
    postOrderSonDetails(argu).then((res) => {
      console.log(res)
      this.setData({
        goodsCover: res.data.goods.cover,
        goodsName: res.data.goods.name,
        goodsId: res.data.goods.id,
        goodsPrice: res.data.goods.price,
        storeName: res.data.storeInfo.storeName,
        quantity: res.data.quantity,
        goodsSpecificationName: res.data.goodsSpecification.goodsSpecificationName
      });
    });
  }
});