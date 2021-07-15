Page({
   data: {
     fileList: [
       {
         url: 'https://img.yzcdn.cn/vant/leaf.jpg',
         name: '图片1',
       },
       // Uploader 根据文件后缀来判断是否为图片文件
       // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
       {
         url: 'http://iph.href.lu/60x60?text=default',
         name: '图片2',
         isImage: true,
         deletable: true,
       },
     ],
   },

   afterRead(event) {
      const { file } = event.detail;
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      wx.uploadFile({
        url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
        filePath: file.url,
        name: 'file',
        formData: { user: 'test' },
        success(res) {
          // 上传完成需要更新 fileList
          const { fileList = [] } = this.data;
          fileList.push({ ...file, url: res.data });
          this.setData({ fileList });
        },
      });
    },
 });