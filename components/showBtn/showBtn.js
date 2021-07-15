Component({
  options:{
    multipleSlots:true
  },
  data: {
    flag: true
  },
  methods:{
    hideshowBtn: function(){
      this.setData({
        flag:!this.data.flag
      })
    },
    showBtns(){
      this.setData({
        flag:!this.data.flag
      })
    }
  },

  onCancel() {
    this.triggerEvent("error");
  },

  onConfirm() {
      wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
      })
      this.triggerEvent("success")
    }
})
