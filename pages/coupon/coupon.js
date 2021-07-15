import { getUserCoupon } from '../../api/user.js';

const app = getApp();

Page({
	data: {
		active: 0,
		couponList:[]
	},
	onLoad() {
		let argu = {
			isLimit:0
		}
		getUserCoupon(argu).then((res) => {
			if (res.code === 200) {
				this.setData({
					couponList: res.data
				});
			}
			console.log(this.data.couponList)
		});

	},
	onChange(e) {
		console.log(e)
		let argu = {
			couponType:e.detail.index
		}
		getUserCoupon(argu).then((res) => {
			if (res.code === 200) {
				this.setData({
					couponList: res.data
				});
			}
		})
	},
	toUse() {
		wx.switchTab({
			url: "/pages/index/index"
		})
	}
});