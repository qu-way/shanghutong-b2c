var app = getApp();
import {getStoreSearch} from '../../api/api'
Page({
    data: {
        keywrod: '',
        searchContent:'',
        searchStatus: false,
        goodsList: [],
        helpKeyword: [],
        historyKeyword: [],
        categoryFilter: false,
        currentSortType: 'default',
        filterCategory: [],
        defaultKeyword: {
            'keyword': '搜索店内商品'
        },
        hotKeyword: [],
        categoryId: 0,
    },
    //返回上一页
    closeSearch: function () {
        wx.navigateBack()
    },
    clearKeyword: function () {
        this.setData({
            keyword: '',
            searchStatus: false
        });
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
			title: app.current.storeName
		});
        this.getHisKeys();
        this.setData({
            storeId:options.storeId
        });
        console.log(options)
    },
    // 添加搜索记录
    wxSearchAddHisKey: function (keyword) {
        var text = {}
        let that = this;
        text.name = keyword;
        if (typeof (text) == "undefined" || text.length == 0) {
            return;
        }
        var value = wx.getStorageSync('shopSearchHisKeys');
        if (value) {
            if (JSON.stringify(value).indexOf(JSON.stringify(text)) < 0) {
                if (value.length > 4) {
                    value.pop();
                }
                value.unshift(text);
            }
            wx.setStorage({
                key: "shopSearchHisKeys",
                data: value,
                success: function () {
                    that.getHisKeys();
                }
            })
        } else {
            value = [];
            value.push(text);
            wx.setStorage({
                key: "shopSearchHisKeys",
                data: value,
                success: function () {
                    that.getHisKeys();
                }
            })
        }
    },
    // 获取记录
    getHisKeys: function () {
        var value = [];
        let that = this;
        try {
            value = wx.getStorageSync('shopSearchHisKeys')
            if (value) {
                that.setData({
                    wxSearchData: value
                });
            }
        } catch (e) {}
    },

    // 清空历史记录
    clearHis: function () {
        var that = this;
        wx.removeStorage({
            key: 'shopSearchHisKeys',
            success: function (res) {
                var value = [];
                that.setData({
                    wxSearchData: value
                });
            }
        })
    },

    //清空输入框
    clearHistory: function () {
        this.setData({
            historyKeyword: []
        })
    },
    //获取查询商品列表
    getGoodsList: function (e) {
        let keyword = this.data.keyword
        let storeId = this.data.storeId
        console.log(keyword)
        this.wxSearchAddHisKey(keyword);
        let argu = {
            storeId: storeId,
            keyWord: keyword
        }
        getStoreSearch(argu).then((res) => {
            if (res.code === 200) {
                this.setData({
                    searchStatus: true,
                    goodsList: res.data
                });
            }
            //重新获取关键词
            this.getHisKeys();
        });
    },
    //点击历史搜索关键词
    onKeywordTap: function (event) {
        this.getSearchResult(event.target.dataset.name);
    },
    //执行历史搜索
    getSearchResult(keyword) {
        this.setData({
            keyword: keyword
        });
        this.getGoodsList();
    },
    onKeywordConfirm(event) {
        this.getSearchResult(event.detail.value);
    },
    // 监听搜索
    formInputSearch(e) {
        this.setData({
            searchContent: e.detail.value
        })
    },
    searchProducts() {
        this.getSearchResult(this.data.searchContent);
    },
    toShop: function (e) {
        wx.navigateTo({
            url: "/pages/shop/shop?storeId="+e.currentTarget.dataset.storeId
          })
    }
})