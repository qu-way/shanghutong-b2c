import {
	getAddressDetails,
	submitOrder,
	getWallet
} from '../../api/payment';
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
		goldcoin: false,
		// 总币
		realCoupons: 0
	},
	onLoad: function (option) {
		//判断页面来源
		console.log(option)
		let pages = getCurrentPages();
		let prevpage = pages[pages.length - 2];
		this.pageroute = prevpage.route;
		console.log(this.pageroute)
		let storeKey = option.storeId
		if (this.pageroute === 'pages/shop/shop') {
			let order = wx.getStorageSync(storeKey);
			console.log(order.cartList)
			this.setData({
				storeKey: storeKey,
				cartList: order.cartList,
				storeName: order.storeName,
				pageRoute: 1,
				cart: {
					count: order.count,
					total: order.total,
					goodsId: order.goodsId
				}
			});
		}
		if (this.pageroute === 'pages/shopCart/shopCart') {
			let ordersList = wx.getStorageSync('order');
			let total = 0;
			var that = this;
			this.setData({
				cartList: ordersList,
				pageRoute: 2,
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
					}
				});
			}
			console.log(this.data.storeName)
		}
		if (this.pageroute === 'pages/details/details') {
			var order = wx.getStorageSync('ordersList');
			this.setData({
				cartList: order.cartList,
				storeName: order.storeName,
				pageRoute: 3,
				cart: {
					count: order.count,
					total: order.total,
					goodsId: order.goodsId
				}
			});
		}
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
		this.myWallet()
	},
	// 获取我的钱包
	myWallet() {
		getWallet().then((res) => {
			console.log(res)
			if (res.code === 200) {
				let couponsMoney = res.data.couponsMoney;
				let freezeCouponsMoney = res.data.freezeCouponsMoney;
				if (Number.isInteger(couponsMoney) && Number.isInteger(freezeCouponsMoney)) {
					var realCoupons = couponsMoney - freezeCouponsMoney;
					var total = this.data.cart.total
					if (total < realCoupons) {
						realCoupons = total
					} else {
						realCoupons = realCoupons
					}
				} else {
					var realCoupons = $h.Sub(couponsMoney, freezeCouponsMoney);
					var total = this.data.cart.total
					if (total < realCoupons) {
						realCoupons = total
					} else {
						realCoupons = realCoupons
					}
				}
				this.setData({
					realCoupons: realCoupons
				});
			}
			console.log(this.data.realCoupons)
		});
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
		var goldcoin = this.data.goldcoin;
		console.log(goldcoin)
		this.setData({
			goldcoin: !goldcoin,
		});
		if (!goldcoin === true) {
			let realCoupons = this.data.realCoupons;
			console.log(realCoupons)
			let total = this.data.cart.total;
			console.log(total)
			//用Number.isInteger()判断是否为整数
			if (Number.isInteger(realCoupons) && Number.isInteger(total)) {
				var realMoney = total - realCoupons
			} else {
				var realMoney = $h.Sub(total, realCoupons)
			}
			console.log(realMoney)
			this.setData({
				realMoney: realMoney,
				cart:{
					total: realMoney
				}
			})
		} else {
			return
		}
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
		for (var index in list) {
			if (list[index].name === name) {
				return index;
			}
		}
		return false;
	},

	//减数量
	tapReduceCart: function (e) {
		var name = e.target.dataset.name;
		var list = this.data.cartList;
		var index, sortedList = [];
		if (index = this.checkOrderSame(name)) {
			var buyNum = list[index].buyNum
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
		this.deduceCount(sortedList);
	},
	// 加数量
	addCount: function (e) {
		console.log(e)
		var list = this.data.cartList;
		let goodsId = e.currentTarget.dataset.goodsId
		for (let i in list) {
			if (list[i].goodsId === goodsId) {
				list[i].buyNum += 1;
				var count = this.data.cart.count + 1
				var total = $h.Add(this.data.cart.total, list[i].price)
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
		console.log(list)
	},

	// 加数量
	addCoun: function (e) {
		console.log(e)
		var list = this.data.cartList;
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
		console.log(list)
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
		let position = this.data.locationList;
		let total = this.data.cart.total
		if (position.length < 1) {
			Notify({
				message: '你还未添加收货地址',
				color: '#ffffff',
				background: '#ff5757',
			});
			return false
		}

		// if (total >= 10) {
		// 	Notify({
		// 		message: '支付金额超过10元，暂不支持',
		// 		color: '#ffffff',
		// 		background: '#ff5757',
		// 	});
		// 	return false
		// }

		let pageRoute = this.data.pageRoute;
		console.log(pageRoute)
		if (pageRoute == 2) {
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
					console.log(cartList)
					for (let i = 0; i < cartList.length; i++) {
						var b = cartList[i].goodsList
						var that = this
						console.log(b)
						let goodsLists = []
						goodsLists = b.map(iterator => {
							return {
								quantity: iterator.buyNum,
								goodsId: iterator.goodsId,
								goodsSpecificationId: iterator.goodsSpecificationId
							}
						})
						console.log(goodsLists)
						let sRemark = that.data.sRemarks;
						let sDistribution = that.data.sDistribution;
						console.log(sDistribution)
						let argu = {
							receiveAddressId: chooseLocation.id,
							logisticsType: sDistribution.value,
							buyerMessage: sRemark.name,
							couponsMoney: that.data.realCoupons,
							detailList: goodsLists,

						}
						submitOrder(argu).then((res) => {
							if (res.code === 200) {
								that.setData({
									orderId: res.data.orderId
								})
								pay.payOrder(res.data.orderId).then(res => {
									let id = that.data.orderId
									let url = `/pages/orderDetail/orderDetail?id=${id}`;
									wx.navigateTo({
										url
									})
									let storeKey = that.data.storeKey
									wx.removeStorageSync(storeKey);
									wx.removeStorageSync('order');
									wx.removeStorageSync('ordersList');
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
			})
		} else {
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
					let cartList = that.data.cartList
					let goodsLists = []
					goodsLists = cartList.map(iterator => {
						return {
							quantity: iterator.buyNum,
							goodsId: iterator.goodsId,
							goodsSpecificationId: iterator.goodsSpecificationId
						}
					})
					console.log(goodsLists)
					let sRemark = that.data.sRemarks;
					let sDistribution = that.data.sDistribution;
					console.log(sDistribution)
					let argu = {
						receiveAddressId: chooseLocation.id,
						logisticsType: sDistribution.value,
						buyerMessage: sRemark.name,
						couponsMoney: that.data.realCoupons,
						detailList: goodsLists
					}
					submitOrder(argu).then((res) => {
						if (res.code === 200) {
							that.setData({
								orderId: res.data.orderId
							})
							pay.payOrder(res.data.orderId).then(res => {
								let id = that.data.orderId
								let url = `/pages/orderDetail/orderDetail?id=${id}`;
								wx.navigateTo({
									url
								})
								let storeKey = that.data.storeKey
								wx.removeStorageSync(storeKey);
								wx.removeStorageSync('order');
								wx.removeStorageSync('ordersList');
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
			})
		}
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