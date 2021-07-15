import {addUserAddress} from '../../../api/address';
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
var app = getApp();
Page({
  data: {
    id: '',
    showTopTips: false,
    address: "",
    region: ['请选择'],
    // customItem: '全部',
    formData: [],
    active: true,
    rules: [{
        name: 'name',
        rules: {
          required: true,
          message: '请填写姓名'
        },
      }, {
        name: 'mobile',
        rules: [{
          required: true,
          message: '请填写手机号码'
        }, {
          mobile: true,
          message: '手机号码格式不正确'
        }],
      },
      {
        name: 'address',
        rules: {
          required: true,
          message: '请填写详细地址'
        },
      }
    ]
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      formData:{defaultChecked:true}
    })
  },
  // methods: {
  //监听姓名
  formInputName(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  //监听手机号
  formInputPhone(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  //监听详细地址
  formInputAddress(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  //监听地区
  formRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  //默认开关
  defaultChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      [`formData.defaultChecked`]: e.detail.value
    });
  },
  //表单提交
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {
        var formData = this.data.formData;
        console.log(formData.defaultChecked)
        var region = this.data.region;
        var id = this.data.id;
        var active = formData.defaultChecked ? 1 : 0;
        console.log(active)
        console.log(region)
        if (region.length<1||region[0] === "请选择") {
          Notify('请选择您所在地址');
          return false
        } else {
          var data = {
            name: formData.name,
            phone: formData.mobile,
            province: region[0],
            city: region[1],
            area: region[2],
            address: formData.address,
            active: active,
            tag: 0
          }
          addUserAddress(data).then((data) => {
            this.setData({
              storeList: data,
            })
            wx.navigateBack({
              delta: 1
            })
          })
        }
      }
    })
  }

});