var app = getApp();
import {
	Http
} from '../../utils/httpClient.js';
import {
	loginNow
} from '../../utils/util';
var httpClient = new Http();
Page({
	data: {
		region: {		//骨架屏区域
			header: true,
			lists: true
	 },
	 showSkeleton: true,
		id: '',
		storeId: '',
		cart: {
			count: 0,
			total: 0
			// goodsId: 0
		},
		specification:[],
		//抛物线小球显示
		hide_good_box: true,
		storeName: '',
		cartList: [],
		localList: [],
		showCartDetail: false,
		defaultImg: '../../images/zhutu.jpg',
		showOneButtonDialog: false,
		specificanId:'',
		heigthArr:'',
		cateList:[
			{'name':'sdjsdjis'},
			{'name':'sdjsdjis'},
			{'name':'sdjsdjis'}
		],
		merchantGoods:[
			{
				'name':	"商品20210106001",
				'price':'50'
			},
			{
				'name':	"商品20210106001",
				'price':'50'
			}
		]
	},
	onLoad: function (options) {
		var data = options
		httpClient.getCategoryList(data).then((data) => {
			if (data) {
				this.setData({
					cateList: data,
					storeName: app.current.storeName,
					storeId: options.storeId
				})
			} else {
				wx.showToast({
					title: '暂无分类',
					icon: 'loading',
					duration: 500
				})
			}
			var cateData = this.data.cateList;
			var first = {
				categoryId: cateData[0].id,
				storeId: cateData[0].storeId
			}
			httpClient.getMerchantGoods(first).then((res) => {
				this.setData({
					categoryId: cateData[0].id
				})
				var self = this;
				setTimeout(function () {
					self.setData({
						merchantGoods: res
					});
				}, 100);
				console.log(res)
			})
		})
		setTimeout(() => {
			let that = this
			that.setData({
        'region.header': false,
        'region.lists': false
			})
		}, 800)
		var res = wx.getStorageSync('orderList');
		if (res) {
			this.setData({
				cart: {
					count: res.count,
					total: res.total,
					goodsId: res.goodsId
				}
			});
			this.setData({
				cartList: res.cartList,
				localList: res.cartList
			})
		}
		{
			var cartList = this.data.cartList;
			this.setData({
				cartList: cartList
			})
		}
},
onShow: function () {
	this.busPos = {};
	this.busPos['x'] = 45; //购物车的位置
	this.busPos['y'] = app.globalData.hh - 56;
},


openConfirm: function () {
	this.setData({
		 dialogShow: true
	})
},

tapDialogButton(e) {
	this.setData({
		 dialogShow: false,
		 showOneButtonDialog: false
	})
},
tapOneDialogButton(e) {
	this.setData({
		 showOneButtonDialog: true
	})
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


 

//添加
tapAddCart: function (e) {
	console.log(this.data.localList)
	console.log(e)
	this.touchOnGoods(e)
	var goodsId = e.currentTarget.dataset.goodsId;
	var price = parseFloat(e.target.dataset.price);
	var name = e.currentTarget.dataset.name;
	var img = e.currentTarget.dataset.pic;
	var specification = e.currentTarget.dataset.spec;
	var list = this.data.cartList;
	var sortedList = [];
	var index;
	var merchant = this.data.merchantGoods
	for (let i = 0; i < merchant.length; i++) {
		if (merchant[i].specificationSelectList.length > 1 && merchant[i].specificationSelectList.length !== undefined) {
			this.setData({
				showOneButtonDialog: true,
				specification: specification
		  })
		  if (index = this.checkOrderSame(name)) {
			sortedList = list[index];
			var num = list[index].num;
			list[index].num = num + 1;
		} else {
			var order = {
				goodsId: goodsId,
				price: price,
				num: 1,
				name: name,
				img: img,
				storeId: this.data.storeId,
				pay: 0,
				specValueId:this.data.specValueId,
				specPrice: this.data.specPrice
			}
			list.push(order);
			sortedList = order;
		}
	} else{
		if (index = this.checkOrderSame(name)) {
			sortedList = list[index];
			var num = list[index].num;
			list[index].num = num + 1;
		} else {
			var order = {
				goodsId: goodsId,
				price: price,
				num: 1,
				name: name,
				img: img,
				storeId: this.data.storeId,
				pay: 0,
				specValueId:this.data.specValueId,
				specPrice: this.data.specPrice
			}
			list.push(order);
			sortedList = order;
		}
		this.setData({
			cartList: list,
			localList: list
		});
	 }
}
	this.addCount(sortedList);
},


//减数量
tapReduceCart: function (e) {
	var name = e.target.dataset.name;
	var price = parseFloat(e.target.dataset.price);
	var list = this.data.cartList;
	var index, sortedList = [];
	if (index = this.checkOrderSame(name)) {
		var num = list[index].num
		if (num > 1) {
			sortedList = list[index];
			list[index].num = num - 1;
		} else {
			sortedList = list[index]
			list.splice(index, 1);
		}
	}
	this.setData({
		cartList: list,
		localList: list
	});
	this.deduceCount(sortedList);
},
clickSkuValue: function (event) {
// 判断是否一样，才可以点击
	let that = this;
	let specNameId = event.currentTarget.dataset.specName;
	let specValueId = event.currentTarget.dataset.valueId;
	let index = event.currentTarget.dataset.index;
	let specPrice = event.currentTarget.dataset.price;
	//判断是否可以点击
	let _specification = this.data.specification;
	console.log(this.data.specification);
	for (let j = 0; j < _specification.length; j++) {
	  if (_specification[j].specificationId == specValueId) {
		 //如果已经选中，则反选
			// var specPrice = _specification[j].specificationList.price
			_specification[j].checked = true;
			this.setData({
				specPrice:specPrice,
				specValueId:specValueId
			 });
			 console.log(this.data.specValueId)
	  } else {
		 _specification[j].checked = false;
	  }
	}
	this.setData({
	  'specification': _specification,
	  specNameId: specNameId
	});
 },

// 添加数量
addCount: function (list) {
	console.log(list)
	var count = this.data.cart.count + 1,
	total = this.data.cart.total + list.price;
	total = Math.round(parseFloat(total));
	this.saveCart(count, total);
	this.tapDialogButton()
},
deduceCount: function (list) {
	var count = this.data.cart.count - 1,
	total = this.data.cart.total - list.price;
	total = Math.round(parseFloat(total));
	this.saveCart(count, total);
},
saveCart: function (count, total) {
	total = Math.round(parseFloat(total));
	if (typeof total === null)
		total = 0;
		this.setData({
			cart: {
				count: count,
				total: total
			}
		});
		wx.setStorage({
			key: 'orderList',
			data: {
				cartList: this.data.cartList,
				count: this.data.cart.count,
				total: this.data.cart.total,
				storeName: this.data.storeName,
				storeId: this.data.storeId,
			}
		})
	
},

follow: function () {
	this.setData({
		followed: !this.data.followed
	});
},
onGoodsScroll: function (e) {
	if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
		this.setData({
			scrollDown: true
		});
	} else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
		this.setData({
			scrollDown: false
		});
	}
	this.data.shop.menu.forEach(function (classify, i) {
		var _h = 70 + classify.menu.length * (46 * 3 + 20 * 2);
		h += _h;
	});
},

// 列表动画
animaINit() {
	let that = this
	app.fadein(that, 'current', 0)
	app.sliderightshow(that, 'current', -200, 0)
	setTimeout(function () {
		app.fadein(that, 'current', 1)
		app.sliderightshow(that, 'current', 0, 1)
	}, 500)
},

getMerchantGoods: function (e) {
	var category = e.currentTarget.dataset.id;
	var data = {
		storeId: e.currentTarget.dataset.storeId,
		categoryId: e.currentTarget.dataset.id
	}
	httpClient.getMerchantGoods(data).then((data) => {
		if (data) {
			this.setData({
				merchantGoods: data,
				categoryId: category,
			})
		}
		var self = this;
		setTimeout(function () {
			wx.pageScrollTo({
				scrollTop: 200,
				duration: 300
			});
			self.setData({
				merchantGoods: data
			});
		}, 100);
	})
	this.animaINit()
},
//抛物线动画
touchOnGoods: function (e) {
	this.finger = {};
	var topPoint = {};
	this.finger['x'] = e.touches["0"].clientX; //点击的位置
	this.finger['y'] = e.touches["0"].clientY;
	if (this.finger['y'] < this.busPos['y']) {
		topPoint['y'] = this.finger['y'] - 10;
	} else {
		topPoint['y'] = this.busPos['y'] - 10;
	}
	topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;
	if (this.finger['x'] > this.busPos['x']) {
		topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
	} else { //
		topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
	}

	this.linePos = app.bezier([this.busPos, topPoint, this.finger], 30);
	this.startAnimation(e);
},
//动画开始
startAnimation: function (e) {
	var index = 0,
		that = this,
		bezier_points = that.linePos['bezier_points'];
	this.setData({
		hide_good_box: false,
		bus_x: that.finger['x'],
		bus_y: that.finger['y']
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
			// goodsId: []
		},
	});
	try {
		this.data.cart.count = 0,
			this.data.cart.total = 0,
			// this.data.cart.goodsId = [],
			wx.removeStorageSync('orderList', )
	} catch (e) {
		console.log("无法清除")
	}
},
//去结算
submit: function (e) {
	if (app.globalData.token.length < 1) {
		loginNow();
		return false
	} else {
		wx.navigateTo({
			url: '/pages/pay/pay'
		})
	}
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
		url: '/pages/shopDetail/shopDetail?id=' + id
	})
},
onPullDownRefresh: function () {
	wx.showNavigationBarLoading(); //在标题栏中显示加载图标
	this.getListIndex();
	wx.hideNavigationBarLoading(); //完成停止加载图标
	wx.stopPullDownRefresh();
}
});