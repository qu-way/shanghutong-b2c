import {
	getAddressDetails,
	submitOrder
} from '../../api/payment';
import {
	getShopList
} from '../../api/cart'
import {
	getUserCoupon
} from '../../api/user.js';
import {
	getUserAddress
} from '../../api/address';
import {
	$h
} from '../../utils/util';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
var app = getApp();

const pay = require('../../utils/payment.js');
Page({
	data: {
		//   地址id
		addressId: '',
		peisong: false,
		youhui: false,
		beizhu: false,
		addressInfo: {},
		pageRoute: 0,
		orderList: [],
		is_empty: false,
		cart: {
			count: 0,
			total: 0,
			reduce: 0
		},
		locationList: [],
		cartList: [],
		distributions: [{
				value: '1',
				name: '快递'
			},
			{
				value: '2',
				name: '自提'
			},
			{
				value: '3',
				name: '配送'
			}
		],
		radio: '1',
		focus: false,
		noAddress: false,
		orderId: "0",
		psTitle: "配送方式",
		sDistribution: {
			name: "请选择配送方式",
			value: "0"
		},
		sCoupon: {
			name: "可选优惠券",
			value: "0"
		},
		sRemarks: {
			name: "可输入备注要求",
			value: "0"
		},
		storeKey: '',
		// 金币
		goldcoin: true,
		// 币值
		monetary: '0',
		cartData: [],
	},
	onLoad: function (option) {
		let storeKey = option.storeId
		let ordersList = wx.getStorageSync('order');
		let total = 0;
		var that = this;
		ordersList.forEach(item => {
			for (let i = 0; i < item.goodsList.length; i++) {
			  if (item.goodsList[i].checked !== true) {
				 item.goodsList.splice(item.goodsList[i], 1)
				 console.log(this.data.ordersList)
				 console.log(this.data.ordersList)
			  }
			}
		})
		for (let i = 0; i < ordersList.length; i++) {
			let goodsList = ordersList[i].goodsList;
			let storeName = ordersList[i].storeName;
			console.log(storeName)
			console.log(goodsList)
			for (let e in goodsList) {
				total += goodsList[e].price * goodsList[e].buyNum;
			}
			this.setData({
				cart: {
					count: goodsList.buyNum,
					total: total,
					goodsId: goodsList.goodsId
				},
				cartList: ordersList
			});
		}
		console.log(this.data.storeName)

		var cartLists = this.data.cartList
		console.log(cartLists)
		this.initData();
	},
	initData() {
		getUserAddress().then((res) => {
			var addressData = res.data;
			if (addressData.length > 0) {
				for (var i = 0; i < addressData.length; i++) {
					if (addressData[i].active === 1) {
						this.setData({
							locationList: addressData[i]
						})
					}
				}
			} else {
				this.setData({
					noAddress: true
				})
			}
		}).catch((e) => {
			console.error(e);
		})
	},
	onShow: function () {
		this.getaddressInfo();
		this.onLineCart()
	},
	onLineCart() {
		getShopList().then((res) => {
			console.log(res.data)
			if (res.code == 200) {
				this.setData({
					cartData: res.data
				})
			} else {
				return false
			}
		})
	},

	selectAddress: function () {
		this.getaddressInfo()
	},
	getaddressInfo: function () {
		let addressId = wx.getStorageSync('addressId')
		if (addressId.length > 0) {
			let argu = {
				id: addressId
			}
			getAddressDetails(argu).then((res) => {
				this.setData({
					locationList: res.data
				});
				console.log(this.data.locationList.length)
			})
		}
	},

	onUnload: function () {
		wx.removeStorage('addressId');
	},

	changeGoldcoin(e) {
		console.log(e)
		this.setData({
			goldcoin: e.detail,
		});
	},
	clickGoldcoin(e) {
		const {
			index
		} = e.currentTarget.dataset;
		const checkbox = this.selectComponent(`.checkboxes-${index}`);
		checkbox.clickGoldcoin();
	},

	// 检查顺序
	checkOrderSame: function (name) {
		var list = this.data.cartList;
		console.log('checkOrderSam');
		console.log(list);
		for (var index in list) {
			if (list[index].name === name) {
				return index;
			}
		}
		return false;
	},

	//减数量
	tapReduceCart: function (e) {
		console.log('减数量');
		let goodsId = e.currentTarget.dataset.goodsId;
    this.changeNum(goodsId, 'reduce');
		/* var name = e.target.dataset.name;
		console.log('name', name);
		var list = this.data.cartList;
		var index, sortedList = [];
		console.log('index=', this.checkOrderSame(name));
		if (index = this.checkOrderSame(name)) {
			var buyNum = list[index].buyNum
			console.log('buyNum', buyNum);
			if (buyNum > 1) {
				sortedList = list[index];
				list[index].buyNum = buyNum - 1;
			} else {
				wx.showToast({
					title: '商品数量不能小于1哦！',
					icon: 'none',
				})
				return false
			}
		}
		this.setData({
			cartList: list,
			localList: list
		});
		this.deduceCount(sortedList); */
	},


	// 加数量
	addCount: function (e) {
    let goodsId = e.currentTarget.dataset.goodsId;
    this.changeNum(goodsId, 'plus');
		/* console.log(e)
		var list = this.data.cartList;
    console.log('添加数量');
		console.log(list)
		let goodsId = e.currentTarget.dataset.goodsId
		for (let index = 0; index < list.length; index++) {
			for (let i in list[index]) {
				for (let k in list[index][i]) {
					if (list[index][i][k].goodsId === goodsId) {
						list[index][i][k].buyNum += 1;
						var count = this.data.cart.count + 1
						var total = $h.Add(this.data.cart.total, list[index][i][k].price)
						this.setData({
							cartList: list,
							cart: {
								count: count,
								total: total
							}
						})
						return i;
					}
				}
			}
		}
		console.log(list) */
	},
  
  // 改变数量
  changeNum: function(goodsId, type) {
    let list = this.data.cartList;
    let count = this.data.cart.count;
    let total = this.data.cart.total;
    for (let index = 0; index < list.length; index++) {
      let item = list[index];
      for (let k = 0; k < item.goodsList.length; k++) {
        let goodsItem = item.goodsList[k];
        if (goodsItem.goodsId == goodsId) {
          if (type == 'plus') {
            // 增加数量
            goodsItem.buyNum += 1;
            count+=1;
            total = $h.Add(total, goodsItem.price);
          } else if (type == 'reduce') {
            // 减少数量
            if (goodsItem.buyNum > 1) {
              goodsItem.buyNum -= 1;
              count-=1;
              total = $h.Sub(total, goodsItem.price)
            } else {
              wx.showToast({
              	title: '商品数量不能小于1哦！',
              	icon: 'none',
              })
            }
          }
          // 设置数据
          this.setData({
          	cartList: list,
          	cart: {
          		count: count,
          		total: total
          	}
          });
         
          // 存储数据
          var goodsId = this.data.cart.goodsId; // 不知为何需要
          this.saveCart(count, total, goodsId);
        }
      }
    }
  },
	deduceCount: function (list) {
		var count = this.data.cart.count - 1;
		var total = $h.Sub(this.data.cart.total, list.price)
		var goodsId = this.data.cart.goodsId;
		this.saveCart(count, total, goodsId);
	},
	saveCart: function (count, total, goodsId) {
		if (typeof total == null) {
			total = 0;
		}
		this.setData({
			cart: {
				count: count,
				total: total,
				goodsId: goodsId
			}
		});
		wx.setStorage({
			key: 'orderList',
			data: {
				cartList: this.data.cartList,
				count: this.data.cart.count,
				total: this.data.cart.total,
				storeName: this.data.storeName,
				storeId: this.data.storeId
			}
		})
	},

	// 显示配送方式
	openDistribution() {
		this.setData({
			distribution: true
		});
	},

	closeDistribution() {
		this.setData({
			distribution: false
		});
	},

	onChange(event) {
		console.log(event)
		this.setData({
			radio: event.detail,
		});
	},

	onClick(e) {
		const {
			name
		} = e.currentTarget.dataset;
		let value = e.currentTarget.dataset;
		console.log(value)
		this.setData({
			radio: name,
			sDistribution: value,
			value: value
		});
	},
	// 显示优惠券
	openCoupon() {
		let argu = {
			isLimit: 0
		}
		getUserCoupon(argu).then((res) => {
			console.log(res.data)
			this.setData({
				couponList: res.data,
				coupon: true
			});
		})
	},
	// 显示订单备注
	openRemarks() {
		this.setData({
			remarks: true
		});
	},

	radioChange(e) {
		console.log('radio发生change事件，携带value值为：', e.detail.value)
		const distributions = this.data.distributions
		for (let i = 0, len = distributions.length; i < len; ++i) {
			distributions[i].checked = distributions[i].value === e.detail.value
		}
		this.setData({
			distributions
		})
	},

	selectCoupon: function (e) {
		console.log(e)
		let coup = e.currentTarget.dataset
		let co = e.currentTarget.dataset.reduce
		let total = this.data.cart.total
		let to = total - co
		this.setData({
			sCoupon: {
				name: "-" + coup.reduce + "元",
				value: coup.id
			},
			cart: {
				reduce: coup.reduce,
				total: to
			},
			coupon: false,
		});
	},

	textConfirm(e) {
		console.log(e)
		let name = e.detail.value;
		this.setData({
			sRemarks: {
				name: name,
				value: "1"
			},
			coupon: false,
		});
	},
	// 关闭half-screen-dialog
	close: function () {
		this.setData({
			distribution: false,
			coupon: false,
			remarks: false
		});
	},
	//不使用优惠券
	notUsed() {
		this.setData({
			sCoupon: {
				name: "不使用优惠券",
				value: "0"
			},
			coupon: false
		})
	},

	//提交订单
	rightOffPay: function () {
		let that = this
		let position = this.data.locationList
		if (position.length < 1) {
			Notify({
				message: '你还未添加收货地址',
				color: '#ffffff',
				background: '#ff5757',
			});
			return false
		}
		console.log(that.data.cartList)
		let chooseLocation = this.data.locationList;
		let speCartList = that.data.cartList
		for (let i = 0; i < speCartList.length; i++) {
			var speId = speCartList[i].goodsSpecification
		}
		console.log(speId)
		wx.showToast({
			title: '正在为您提交订单',
			icon: 'loading',
			mask: true,
			success: function () {
				let cartList = that.data.cartList;
				let cartData = that.data.cartData;
				console.log(cartList)
				for (let i = 0; i < cartList.length; i++) {
					for (let index = 0; index < cartList[i].goodsList.length; index++) {
						let dGoodsId = cartList[i].goodsList[index].goodsId;
						var eGoods = cartList[i].goodsList
						for (dGoodsId in cartData) {
							var goodsLists = []
							goodsLists = eGoods.map(iterator => {
								return {
									quantity: iterator.buyNum,
									goodsId: iterator.goodsId,
									goodsSpecificationId: iterator.goodsSpecificationId
								}
							})
							console.log(goodsLists)
						}
						console.log(goodsLists)
						let sRemark = that.data.sRemarks;
						let sDistribution = that.data.sDistribution;
						console.log(sDistribution)
						let argu = {
							receiveAddressId: chooseLocation.id,
							logisticsType: sDistribution.value,
							buyerMessage: sRemark.name,
							detailList: goodsLists
						}
						submitOrder(argu).then((res) => {
							if (res.code === 200) {
								that.setData({
									orderId: res.data.orderId
								})
								pay.payOrder(res.data.orderId).then(res => {
									let id = that.data.orderId;
									console.log(id)
									let url = `/pages/orderDetail/orderDetail?id=${id}`;
									wx.navigateTo({
										url
									})
									wx.removeStorageSync('order');
								})
							} else {
								wx.showModal({
									showCancel: false,
									title: '提交订单失败',
									content: '请在重新授权后提交订单',
									success: function (res) {
										if (res.confirm) {
											app.getUserInfo();
										}
									}
								})
							}
						})
					}
				}
			}
		})
	},


	isEmptyObject(obj) {
		if ((typeof obj === "object" && !(obj instanceof Array)) || ((obj instanceof Array) && obj.length <= 0)) {
			var isEmpty = true;
			for (var prop in obj) {
				isEmpty = false;
				break;
			}
			return isEmpty;
		}
		return false;
	}
});