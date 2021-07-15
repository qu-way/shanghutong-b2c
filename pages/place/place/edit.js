import {editUserAddress,delUserAddress} from '../../../api/address';
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
var app = getApp();
Page({
  data: {
    id: '',
    showTopTips: false,
    region: ['请选择'],
    // customItem: '全部',
    formData: [
      'defaultChecked:true'
    ],
    rules: [{
        name: 'name',
        rules: {
          required: true,
          message: '请填写姓名'
        },
      }, {
        name: 'phone',
        rules: [{
          required: true,
          message: '请填写手机号码'
        }, {
          phone: true,
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
    console.log(options)
    var formData = this.data.formData
    console.log(formData);
    let defaultChecked = options.active === "1" ? true : false;
    console.log(defaultChecked)
    formData = options
    this.setData({
      [`formData.id`]: options.id,
      [`formData.name`]: options.name,
      [`formData.phone`]: options.phone,
      region: [options.province, options.city, options.area],
      [`formData.address`]: options.address,
      [`formData.defaultChecked`]: defaultChecked,
    })
    console.log(this.data.region)
  },
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
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },
  //默认开关
  defaultChange: function (e) {
    console.log(e)
    this.setData({
      [`formData.defaultChecked`]: e.detail.value
    });
  },
  //表单提交
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        var region = this.data.region
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        } else if (region.length>0 && region!=='请选择'){
          Notify('请选择您所在地址');
        }
      } else {
        var formData = this.data.formData;
        var region = this.data.region;
        let id = this.data.id;
        var active = formData.defaultChecked ? 1 : 0;
        var argu = {
          id: formData.id,
          name: formData.name,
          phone: formData.phone,
          province: region[0],
          city: region[1],
          area: region[2],
          address: formData.address,
          active: active,
          tag: 0
        }
        editUserAddress(argu).then((argu) => {
          this.setData({
            storeList: argu,
          })
          wx.navigateBack({
            delta: 1
          })
        })

      }
    })
  },
    delAddress:function() {
      var formData = this.data.formData;
      let argu = {
        ids:formData.id
      }
      delUserAddress(argu).then((res) => {
        if(res.code===200) {
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    }
});