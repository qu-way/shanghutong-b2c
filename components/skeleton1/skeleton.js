const App = getApp()

Component({
    properties: {
        //选择器(外层容器)
        selector: {
            type: String,
            value: "skeleton"
        },
        //外层容器背景颜色
        backgroundColor: {
            type: String,
            value: "#fff"
        },
        //骨架元素浅色背景颜色
        skeletonLightBgColor: {
            type: String,
            value: "#e9e9e9"
        },
        //骨架元素深色背景颜色
        skeletonDarkBgColor: {
            type: String,
            value: "#cecece"
        },
        //骨架元素类型：矩形，圆形，带圆角矩形，椭圆矩形，深色矩形["rect","round","round-rect", "oval-rect", "dark-rect"]
        //默认所有，根据页面情况进行传值
        //页面对应元素class为：skeleton-rect，skeleton-round，skeleton-round-rect skeleton-oval-rect skeleton-dark-rect
        //如果传入的值不在下列数组中，则为自定义class值，默认按矩形渲染
        skeletonType: {
            type: Array,
            value: ["rect", "round", "round-rect", "oval-rect", "dark-rect"]
        },
        //圆角矩形圆角值，skeletonType=round-rect时生效
        roundRectRadius: {
            type: String,
            value: "10rpx"
        },
        //深色矩形圆角值，skeletonType=oval-rect时生效
        ovalRectRadius: {
            type: String,
            value: "1000rpx"
        },
        //深色矩形圆角值，skeletonType=dark-rect时生效
        darkRectRadius: {
            type: String,
            value: "10rpx"
        },
        //骨架屏预生成数据：提前生成好的数据，当传入该属性值时，则不会再次查找子节点信息
        preloadData: {
            type: Array,
            value: []
        },
        //是否需要loading
        isLoading: {
            type: Boolean,
            value: false
        },
        //loading类型[1-10]
        loadingType: {
            type: Number,
            value: 1
        }
    },
    lifetimes: {
        attached: function () {
            this.setData({
                winWidth: App.WinWidth,
                winHeight: App.WinHeight
            }, () =>{
                this.init(true)
            })
        },
        ready: function () {
            this.nodesRef(`.${this.data.selector}`).then((res) => {
                let domHeight = res[0].height + res[0].top
                this.setData({
                    winHeight: (App.WinHeight > domHeight ? App.WinHeight : res[0].height + res[0].top)
                })
            });
            !this.init() && this.selectorQuery()
        }
    },
    data: {
        winWidth: App.WinWidth,
        winHeight: App.WinHeight,
        skeletonElements: []
    },
    methods: {
        init(val) {
            let preloadData = this.data.preloadData || []
            if (preloadData.length) {
                if (val) {
                    this.setData({
                        skeletonElements: preloadData
                    })
                }
                return true
            }
            return false
        },
        async selectorQuery() {
            let skeletonType = this.data.skeletonType || []
            let nodes = []
            for (let item of skeletonType) {
                let className = `.${this.data.selector} >>> .${item}`
                if (~"rect_round_round-rect_oval-rect_dark-rect".indexOf(item)) {
                    className = `.${this.data.selector} >>> .${this.data.selector}-${item}`
                }
                await this.nodesRef(className).then(res => {
                    res.map(s => {
                        s.skeletonType = item
                    })
                    nodes = nodes.concat(res)
                })
            }
            this.setData({
                skeletonElements: nodes
            })
        },
        async nodesRef(className) {
            return await new Promise((resolve, reject) => {
                wx.createSelectorQuery().selectAll(className).boundingClientRect((res) => {
                    if (res) {
                        resolve(res);
                    } else {
                        reject(res)
                    }
                }).exec();
            })
        }
    }
})