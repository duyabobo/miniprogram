const config = require('../../config.js')
const {myRequest} = require("../../util/request");

Page({
  onLoad() {
    this.ctx = wx.createCameraContext()
  },

  cancelPhoto() {
    myRequest({
      url: config.updateHeadImgUrl,
      method: "PUT",
      data: {},
      success(res) {
        wx.switchTab({
          url: config.MINE_PAGE,
        })
      }
    })
  },

  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        wx.showToast({ icon: "loading", title: "虚拟头像制作中" });
        wx.uploadFile({
          url: config.updateHeadImgUrl,
          filePath: res.tempImagePath,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success (res){
            console.log(res)
          },
          fail (res) {
            console.log(res)
          }
        })
      }
    })
  }, 
  
  error(e) {
    console.log(e.detail)
  }
})