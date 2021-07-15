import {
	getCategoryList,
	getMerchantGoods,
	getStoreInfo,
	getStoreCoupon,
	receiveCoupon
} from '../../api/store.js';
import {
	addShoppingCart
} from '../../api/details.js';
import {
	fadein,
	sliderightshow,
	bezier
} from '../../utils/animation.js'
var app = getApp();
import {
	loginNow,
	$h
} from '../../utils/util';
Page({
	data: {
		loading: true,
		id: '',
		cart: {
			count: 0,
			total: 0
		},
		// 规格列表
		cover: "",
		specificationList: [],
		specification: [],
		//抛物线小球显示
		hide_good_box: true,
		// 店铺信息
		storeId: '',
		storeName: "",
		logoUrl: '',
		isCommonLogistics: 0,
		isSelfLifting: 0,
		isSelfSupport: 0,
		cartList: [],
		// localList: [],
		showCartDetail: false,
		defaultImg: '../../images/wuzhutu.png',
		openAttr: false,
		//优惠券
		receive: false,
		goodsId: '',
		name: "",
		price: 0,
		checkSp: [],
		couponList: [],
		cateName: "",
		ani: true
	},
	onLoad: function (options) {
		console.log(options)
		var data = options
		getCategoryList(data).then((res) => {
			if (res && res.data.length > 0) {
				this.setData({
					cateList: res.data
				})
			} else {
				wx.showToast({
					title: '暂无分类',
					icon: 'error',
					duration: 1000
				});
				return false
			}
			var first = {
				categoryId: res.data[0].id,
				storeId: res.data[0].storeId
			}
			getMerchantGoods(first).then((res) => {
				var cateData = this.data.cateList;
				this.setData({
					categoryId: cateData[0].id,
					cateName: cateData[0].name
				})
				let self = this;
				self.setData({
					merchantGoods: res.data
				});
				if (res.data.length > 0) {
					self.defaultCheck(res.data)
				}
			})
		})
		getStoreInfo(data).then((res) => {
			console.log(res)
			this.setData({
				storeId: res.data.storeId,
				storeName: res.data.storeName,
				isCommonLogistics: res.data.isCommonLogistics,
				isSelfLifting: res.data.isSelfLifting,
				isSelfSupport: res.data.isSelfSupport,
				logoUrl: res.data.logoUrl
			});
		})
		let storeKey = options.storeId;
		console.log(storeKey)
		let res = wx.getStorageSync(storeKey);
		if (res) {
			this.setData({
				cart: {
					count: res.count,
					total: res.total
				},
				cartList: res.cartList
			});
		}
		// wx.setNavigationBarTitle({
		// 	title: app.current.storeName
		// });
		//可领取优惠券
		this.getStoreCoupon(options)
	},
	onShow: function () {
		this.busPos = {};
		this.busPos['x'] = 45; //购物车的位置
		this.busPos['y'] = app.globalData.hh - 56;
	},
	onReady: function () {
		let that = this
		that.setData({
			loading: false,
		});
	},
	//请求可领取优惠券
	getStoreCoupon(options) {
		getStoreCoupon(options).then((res) => {
			if (res && res.data.length > 0) {
				this.setData({
					couponList: res.data
				});
			}
		})
	},

	// 检查顺序商品名称
	checkOrderSame: function (name) {
		var list = this.data.cartList;
		for (var index in list) {
			if (list[index].name === name) {
				return index;
			}
		}
		return false;
	},
	// 检查商品规格id
	checkSpecSame: function (specificationId) {
		var list = this.data.cartList;
		for (let i in list) {
			for (let index in list[i]) {
				if (list[i][index].specificationId === specificationId) {
					return i;
				}
			}
		}
		return false;
	},

	// 获取分类下的商品
	getMerchantGoods: function (e) {
		var that = this
		var category = e.currentTarget.dataset.id;
		var data = {
			storeId: e.currentTarget.dataset.storeId,
			categoryId: e.currentTarget.dataset.id
		}
		let cateName = e.currentTarget.dataset.name
		getMerchantGoods(data).then((res) => {
			if (res.code == 200) {
				this.setData({
					merchantGoods: res.data,
					categoryId: category,
					cateName: cateName
				})
			}
			if (res.data.length > 0) {
				that.defaultCheck(res.data)
			}
		})

		// that.animaINit()
	},
	// 如果商品只有一种规格默认选中
	defaultCheck(e) {
		var ds = e;
		for (let i = 0; i < ds.length; i++) {
			// 如果仅仅存在一种货品，那么商品页面初始化时默认checked
			console.log(ds[i].specificationSelectList.length)
			if (ds[i].specificationSelectList.length == 1) {
				let that = this
				let fs = ds[i].specificationSelectList
				fs[0].checked = true
				that.setData({
					checkedSpecText: fs[0].goodsSpecificationName,
					tmpSpecText: fs[0].goodsSpecificationName,
					checkSpecName: fs[0].goodsSpecificationName,
					checkSpecId: fs[0].specificationId,
					checkSpecPrice: fs[0].price
				});
				console.log(this.data.checkSpecId)
			} else {
				let that = this
				that.setData({
					checkedSpecText: '请选择规格和数量'
				});
			}
			return false
		}
	},

	clickSkuValue: function (event) {
		// 判断是否一样，才可以点击
		let specName = event.currentTarget.dataset.specName;
		let specValueId = event.currentTarget.dataset.valueId;
		let specPrice = event.currentTarget.dataset.price;
		//判断是否可以点击
		let _specification = this.data.specificationList;
		console.log(this.data.specification);
		for (let j = 0; j < _specification.length; j++) {
			if (_specification[j].specificationId == specValueId) {
				//如果已经选中，则反选
				_specification[j].checked = true;
				this.setData({
					specPrice: specPrice,
					specValueId: specValueId,
					checkSpecificaName: specName
				});
				console.log(this.data.specValueId)
			} else {
				_specification[j].checked = false;
			}
		}
		this.setData({
			'specificationList': _specification,
			checkSpecName: specName,
			checkSpecId: specValueId,
			checkSpecPrice: specPrice
		});
		//重新计算spec改变后的信息
		this.changeSpecInfo();
	},
	//获取选中的规格信息
	getCheckedSpecValue: function () {
		let checkedValues = [];
		let _specificationList = this.data.specificationList;
		let _checkedObj = {
			nameId: _specificationList.specificationId,
			valueId: 0,
			valueText: ''
		};
		for (let j = 0; j < _specificationList.length; j++) {
			if (_specificationList[j].checked) {
				_checkedObj.valueId = _specificationList[j].specificationId;
				_checkedObj.valueText = _specificationList[j].goodsSpecificationName;
			}
		}
		checkedValues.push(_checkedObj);
		this.setData({
			checkSp: checkedValues
		})
		return checkedValues;
	},
	//根据已选的值，计算其它值的状态
	setSpecValueStatus: function () {},
	//判断规格是否选择完整
	isCheckedAllSpec: function () {
		return !this.getCheckedSpecValue().some(function (v) {
			if (v.valueId == 0) {
				return true;
			}
		});
	},

	changeSpecInfo: function () {
		let checkedNameValue = this.getCheckedSpecValue();
		this.setData({
			disabled: '',
			number: 1
		});
		//设置选择的信息
		let checkedValue = checkedNameValue.filter(function (v) {
			if (v.valueId != 0) {
				return true;
			} else {
				return false;
			}
		}).map(function (v) {
			return v.valueText;
		});
		if (checkedValue.length > 0) {
			this.setData({
				tmpSpecText: checkedValue.join('　'),
				priceChecked: true
			});
		} else {
			this.setData({
				tmpSpecText: '请选择规格和数量',
				priceChecked: false
			});
		}
		if (this.isCheckedAllSpec()) {
			this.setData({
				checkedSpecText: this.data.tmpSpecText,
				checkedSpecPrice: this.data.specPrice,
				soldout: true
			});
		} else {
			this.setData({
				checkedSpecText: '请选择规格和数量',
				checkedSpecPrice: this.data.specificationList.price,
				soldout: false
			});
		}
	},

	//添加
	tapAddCart: function (e) {
		this.wxloginNow();
		this.touchOnGoods(e)
		var goodsId = e.currentTarget.dataset.goodsId;
		var price = parseFloat(e.target.dataset.price);
		var buyNum = e.currentTarget.dataset.buyNum;
		var name = e.target.dataset.name;
		var cover = e.target.dataset.cover;
		var list = this.data.cartList;
		let specification = e.currentTarget.dataset.spec;
		console.log(cover)
		this.setData({
			goodsId: goodsId,
			price: price,
			name: name,
			cover: cover
		})
		var sortedList = [];
		var index;
		console.log(specification)
		console.log(cover)
		for (let i = 0; i < specification.length; i++) {
			var sepcList = {
				specificationId: specification[i].specificationId,
				goodsSpecificationName: specification[i].goodsSpecificationName,
				specificationPrice: specification[i].price
			}
		}
		console.log(specification)
		if (specification === undefined) {
			this.setData({
				specificationList: specification
			})
			return false
		} else if (specification.length > 1 && specification.length !== undefined) {
			this.setData({
				openAttr: true,
				specificationList: specification
			})
			return false
		}


		if (index = this.checkOrderSame(name)) {
			sortedList = list[index];
			var buyNum = list[index].buyNum;
			list[index].buyNum = buyNum + 1;
		} else {
			console.log(this.data.checkSpecName)
			console.log(this.data.checkSpecId)
			var order = {
				goodsId: goodsId,
				price: price,
				buyNum: 1,
				cover: cover,
				name: name,
				storeId: this.data.storeId,
				goodsSpecification: sepcList,
				goodsSpecificationId: this.data.checkSpecId
			}
			list.push(order);
			sortedList = order;
		}
		this.setData({
			cartList: list
		});
		this.addCount(sortedList);
		this.closeAttr();
		let goodsSpecificationId = this.data.checkSpecId;
		let number = 1
		this.addToCart(goodsId, goodsSpecificationId, number)
	},

	//添加
	bomAddCart: function (e) {
		this.wxloginNow();
		console.log(e)
		let name = e.target.dataset.name;
		var sortedList = [];
		let index;
		var list = this.data.cartList;
		if (index = this.checkOrderSame(name)) {
			sortedList = list[index];
			let buyNum = list[index].buyNum;
			list[index].buyNum = buyNum + 1;
		}
		this.setData({
			cartList: list
		})
		this.addCount(sortedList);
	},

	addToCart: function (goodsId, goodsSpecificationId, buyNum) {
		this.wxloginNow();
		let argu = {
			goodsId: goodsId,
			goodsSpecificationId: goodsSpecificationId, //规格,
			buyNum: buyNum
		}
		addShoppingCart(argu).then((data) => {
			if (data.code !== 200) {
				wx.showToast({
					title: data.msg,
					icon: 'error',
					duration: 1000
				})
			}
		})
	},

	//添加
	addCart: function (e) {
		this.wxloginNow();
		let specValueId = this.data.specValueId
		if (specValueId === undefined) {
			wx.showToast({
				title: '请选择规格',
				icon: 'error'
			})
			return false
		} else {
			console.log(e)
			let sortedList = [];
			let index;
			let list = this.data.cartList;
			let specSame = this.data.checkSpecId;
			if (index = this.checkSpecSame(specSame)) {
				sortedList = list[index];
				let buyNum = list[index].buyNum;
				list[index].buyNum = buyNum + 1;
			} else {
				let goodsSpecification = {
					specificationId: this.data.checkSpecId,
					goodsSpecificationName: this.data.checkSpecName,
					specificationPrice: this.data.checkSpecPrice,
					buyNum: 1
				}
				var order = {
					goodsId: this.data.goodsId,
					price: this.data.checkSpecPrice,
					buyNum: 1,
					cover: this.data.cover,
					name: this.data.name,
					storeId: this.data.storeId,
					goodsSpecification: goodsSpecification,
					goodsSpecificationId: this.data.checkSpecId,
					goodsSpecificationName: this.data.checkedSpecText
				}
				list.push(order);
				sortedList = order;
			}
			this.setData({
				openAttr: false,
				cartList: list
			});
			this.addCount(sortedList);
			let goodsId = this.data.goodsId;
			let goodsSpecificationId = this.data.checkSpecId;
			let number = 1;
			this.addToCart(goodsId, goodsSpecificationId, number)
		}
	},
	//减数量
	tapReduceCart: function (e) {
		this.wxloginNow();
		var name = e.target.dataset.name;
		var list = this.data.cartList;
		var index, sortedList = [];
		if (index = this.checkOrderSame(name)) {
			var buyNum = list[index].buyNum
			if (buyNum > 1) {
				sortedList = list[index];
				list[index].buyNum = buyNum - 1;
			} else {
				sortedList = list[index]
				list.splice(index, 1);
			}
		}
		this.setData({
			cartList: list,
		});
		this.deduceCount(sortedList);
	},
	addCount: function (list) {
		var count = this.data.cart.count + 1
		var total = $h.Add(this.data.cart.total, list.price)
		this.saveCart(count, total);
	},
	deduceCount: function (list) {
		var count = this.data.cart.count - 1
		var total = $h.Sub(this.data.cart.total, list.price)
		console.log(total)
		this.saveCart(count, total);
	},
	saveCart: function (count, total) {
		this.cartWwing()
		console.log(total)
		this.setData({
			cart: {
				count: count,
				total: total
			}
		});
		let storeKey = this.data.storeId
		wx.setStorage({
			key: storeKey,
			data: {
				cartList: this.data.cartList,
				count: this.data.cart.count,
				total: this.data.cart.total,
				storeName: this.data.storeName,
				storeId: this.data.storeId,
			}
		})
		if (count === 0) {
			wx.removeStorage({
				key: storeKey
			})
		}
	},
	cartWwing() {
		var animation = wx.createAnimation({
			duration: 140, //动画持续时间
			timingFunction: 'ease-in', //动画以低速开始
		})
		animation.translateX(6).rotate(21).step()
		animation.translateX(-6).rotate(-21).step()
		animation.translateX(0).rotate(0).step()
		// 3.导出动画
		this.setData({
			ani: animation.export()
		})
	},
	// 列表动画
	animaINit() {
		let that = this
		fadein(that, 'current', 0)
		sliderightshow(that, 'current', -200, 0)
		setTimeout(function () {
			fadein(that, 'current', 1)
			sliderightshow(that, 'current', 0, 1)
		}, 400)
	},
	//抛物线动画
	touchOnGoods: function (e) {
		this.finger = {};
		var topPoint = {};
		this.finger['x'] = e.touches["0"].clientX; //点击的位置
		this.finger['y'] = e.touches["0"].clientY;
		if (this.finger['y'] < this.busPos['y']) {
			topPoint['y'] = this.finger['y'] - 150;
		} else {
			topPoint['y'] = this.busPos['y'] - 150;
		}
		topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;
		if (this.finger['x'] > this.busPos['x']) {
			topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
		} else {
			topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
		}
		this.linePos = bezier([this.busPos, topPoint, this.finger], 20);
		this.startAnimation(e);
	},
	//动画开始
	startAnimation: function (e) {
		var index = 0,
			that = this,
			bezier_points = that.linePos['bezier_points'];
		this.setData({
			hide_good_box: false,
			bus_x: that.finger['x'] - 8,
			bus_y: that.finger['y'] - 10
		})
		var len = bezier_points.length;
		index = len
		this.timer = setInterval(function () {
			for (let i = index - 1; i > -1; i--) {
				that.setData({
					bus_x: bezier_points[i]['x'],
					bus_y: bezier_points[i]['y']
				})
				if (i < 1) {
					clearInterval(that.timer);
					that.setData({
						hide_good_box: true
					})
				}
			}
		}, 25);
	},

	// tapClassify: function (e) {
	// 	var id = e.target.dataset.id;
	// 	console.log(id);
	// 	this.setData({
	// 		classifyViewed: id
	// 	});
	// 	console.log(this.data.classifyViewed)
	// 	var self = this;
	// 	setTimeout(function () {
	// 		self.setData({
	// 			classifySeleted: id
	// 		});
	// 	}, 100);
	// },
	//领取优惠券
	upCoupon: function (e) {
		if (app.globalData.token.length < 1) {
			loginNow();
			return false
		} else {
			console.log(e)
			let argu = {
				couponId: e.currentTarget.dataset.couponId
			}
			receiveCoupon(argu).then((res) => {
				console.log(res)
				if (res.code === 200) {
					let couponList = this.data.couponList
					for (let i = 0; i < couponList.length; i++) {
						if (couponList[i].id === argu.couponId) {
							couponList[i].reCoupon = true
						}
					}
					this.setData({
						couponList: couponList
					})
					console.log(couponList)
					wx.showToast({
						title: '领取成功',
						icon: 'success',
						duration: 2000
					})
				} else if (res.code === 300006) {
					let couponList = this.data.couponList
					for (let i = 0; i < couponList.length; i++) {
						if (couponList[i].id === argu.couponId) {
							couponList[i].reCoupon = true
						}
					}
					this.setData({
						couponList: couponList
					})
					console.log(couponList)
					wx.showToast({
						title: "优惠券已领过啦",
						icon: 'error',
						duration: 2000
					})
				} else {
					wx.showToast({
						title: "领取失败",
						icon: 'error',
						duration: 2000
					})
				}
			})
		}
	},
	//优惠券弹窗
	showReceive: function () {
		let couponList = this.data.couponList
		if (couponList.length > 0) {
			this.setData({
				receive: true
			})
		}
	},
	// 关闭
	hideReceive: function () {
		this.setData({
			receive: false
		});
	},
	showCartDetail: function () {
		this.setData({
			showCartDetail: !this.data.showCartDetail
		});
	},
	hideCartDetail: function () {
		this.setData({
			showCartDetail: false
		});
	},
	//清空购物车
	cleanCart: function () {
		this.setData({
			cartList: [],
			cart: {
				count: 0,
				total: 0,
			},
		});
		let storeKey = this.data.storeId
		try {
			wx.removeStorageSync(storeKey);
			this.hideCartDetail()
		} catch (e) {
			wx.showToast({
				title: '无法清除',
				icon: 'error',
				duration: 1000
			})
		}
	},
	//去结算
	submit: function (e) {
		let storeKey = this.data.storeId
		if (app.globalData.token.length < 1) {
			loginNow();
			return false
		} else {
			wx.navigateTo({
				url: '/pages/pay/pay?storeId=' + storeKey
			})
		}
	},
	// 商品规格弹窗
	switchAttrPop: function () {
		if (this.data.openAttr == false) {
			this.setData({
				openAttr: !this.data.openAttr
			});
		}
	},
	closeAttr: function () {
		this.setData({
			openAttr: false
		});
	},
	// 去店内搜索
	toSearchs: function (e) {
		let storeId = e.currentTarget.dataset.storeId;
		console.log(storeId)
		wx.navigateTo({
			url: '/pages/searchs/searchs?storeId=' + storeId
		})
	},

	goDetail: function (e) {
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/details/details?id=' + id
		})
	},
	goShopDetail() {
		let id = this.data.storeId
		console.log(id)
		wx.navigateTo({
			url: '/pages/shopDetail/shopDetail?storeId=' + id
		})
	},
	onPullDownRefresh: function () {
		wx.showNavigationBarLoading(); //在标题栏中显示加载图标
		this.getListIndex();
		wx.hideNavigationBarLoading(); //完成停止加载图标
		wx.stopPullDownRefresh();
	},
	wxloginNow() {
		if (app.globalData.token.length < 1) {
			loginNow();
		}
		return false
	}
});