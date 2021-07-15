Page({
  data:{},
  onReady:function(){
    this.showBtn = this.selectComponent("#showBtn")
  },
  delete(){
    this.showBtn.showBtns()
  },
  onCancel(){
    this.showBtn.hideshowBtn()
  },
  onConfirm(){
    this.showBtn.hideshowBtn()
  },
  
})