Component({
  properties: {
    dropDownMenuTitle: {
      type: Array,
      value: [],
    },
    dropDownMenuDistrictData: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        console.log(newVal)
        let model = newVal[0] ? newVal[0] : null
        this.selectDefaltDistrictLeft(model)
      }
    },

    dropDownMenuSourceData: {
      type: Array,
      value: []
    },
    dropDownMenuStyleData: {
      type: Array,
      value: []
    },
    dropDownMenuFilterData: {
      type: Array,
      value: []
    },
  },
  data: {
    // private properity
    district_open: false, // 区域
    source_open: false, // 来源
    style_open: false, // 排序
    filteropen: false, // 筛选
    shownavindex: '',
    dropDownMenuDistrictDataRight: {},
    district_left_select: '',
    district_right_select: '',
    district_right_select_name: '',
    selected_style_id: 0,
    selected_style_name: '',
    selected_source_id: 0,
    selected_source_name: '',
    selected_filter_id: 0,
    selected_filter_name: '',
    arr:{
      districtCode:"01",
      districtName:"不限"
    },
    arr:{
      townCode:"001",
      townName:"不限"
    }

  },
  methods: {
    tapDistrictNav: function(e) {
      //  wx.pageScrollTo({
      //   scrollTop: e.target.offsetTop + 10,
      //    duration: 300
      // })
 
      if (this.data.district_open) {
        this.setData({
          district_open: false,
          source_open: false,
          style_open: false,
          filter_open: false,
          shownavindex: 0,
          district_left_select,
        })
      } else {
        this.setData({
          district_open: true,
          style_open: false,
          source_open: false,
          filter_open: false,
          shownavindex: e.currentTarget.dataset.nav
        })
      }

    },
    tapSourceNav: function(e) {
      if (this.data.source_open) {
        this.setData({
          source_open: false,
          style_open: false,
          district_open: false,
          filter_open: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          source_open: true,
          style_open: false,
          district_open: false,
          filter_open: false,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
    },
    tapStyleNav: function(e) {
      if (this.data.style_open) {
        this.setData({
          source_open: false,
          style_open: false,
          district_open: false,
          filter_open: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          source_open: false,
          style_open: true,
          filter_open: false,
          district_open: false,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
      console.log(e.target)
    },
    tapFilterNav: function(e) {
      if (this.data.filter_open) {
        this.setData({
          source_open: false,
          style_open: false,
          district_open: false,
          filter_open: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          source_open: false,
          style_open: false,
          district_open: false,
          filter_open: true,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
    },

    selectDefaltDistrictLeft(model) {
      console.log(model)
      if (!model) {
        return
      }
      var model = model.addressTowns;
      var selectedId = model.districtCode
      var selectedTitle = model.districtName;
      this.setData({
        dropDownMenuDistrictDataRight: model ? model : '',
        district_left_select: selectedId,
        district_right_select: ''
      })
    },

    selectDistrictLeft: function(e) {
      console.log(e)
      var model = e.target.dataset.model.addressTowns;
      var selectedId = e.target.dataset.model.districtCode
      var selectedTitle = e.target.dataset.model.districtName;
      this.setData({
        dropDownMenuDistrictDataRight: model ? model : '',
        district_left_select: selectedId,
        district_right_select: '',
        selectedTitle:selectedTitle
      })
    },

    selectDistrictRight: function(e) {
      console.log(e)
      var selectedId = e.target.dataset.model.townCode
      var selectedTitle = e.target.dataset.model.townName;
      this.closeHyFilter();
      this.setData({
        district_right_select: selectedId,
        district_right_select_name: selectedTitle
      })
      this.triggerEvent("selectedItem", {
        index: this.data.shownavindex,
        selectedId: selectedId,
        selectedTitle: selectedTitle
      })
    },

    selectSourceItem: function(e) {
      console.log(e)
      var selectedId = e.target.dataset.model.dictValue
      var selectedTitle = e.target.dataset.model.dictLabel;
      this.closeHyFilter();
      this.setData({
        selected_source_id: selectedId,
        selected_source_name: selectedTitle
      })
      this.triggerEvent("selectedItem", {
        index: this.data.shownavindex,
        selectedId: selectedId,
        selectedTitle: selectedTitle
      })
    },

    selectFilterItem: function(e) {
      var selectedId = e.target.dataset.model.id
      var selectedTitle = e.target.dataset.model.title;
      this.closeHyFilter();
      this.setData({
        selected_filter_id: selectedId,
        selected_filter_name: selectedTitle
      })
      this.triggerEvent("selectedItem", {
        index: this.data.shownavindex,
        selectedId: selectedId,
        selectedTitle: selectedTitle
      })
    },

    selectStyleItem: function(e) {
      var selectedId = e.target.dataset.model.id
      var selectedTitle = e.target.dataset.model.title;
      this.closeHyFilter();
      this.setData({
        selected_style_id: selectedId,
        selected_style_name: selectedTitle
      })
      this.triggerEvent("selectedItem", {
        index: this.data.shownavindex,
        selectedId: selectedId,
        selectedTitle: selectedTitle
      })
    },

  

    /**关闭筛选 */
    closeHyFilter: function() {
      if (this.data.district_open) {
        this.setData({
          district_open: false,
          source_open: false,
          style_open: false,
          filter_open: false,
        })
      } else if (this.data.source_open) {
        this.setData({
          source_open: false,
          style_open: false,
          district_open: false,
          filter_open: false,
        })
      } else if (this.data.style_open) {
        this.setData({
          source_open: false,
          style_open: false,
          district_open: false,
          filter_open: false,
        })
      } else if (this.data.filter_open) {
        this.setData({
          source_open: false,
          style_open: false,
          district_open: false,
          filter_open: false,
        })
      }
    },
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function() {


  },

})