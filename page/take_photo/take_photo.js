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
        myRequest({
          url: config.updateHeadImgUrl,
          method: "POST",
          data: {},
          success(res) {
            console.log(res)
            console.log(res.tempImagePath)
            wx.showModal({
              title: '虚拟头像制作完成',
              content: '',
              showCancel: false,
              success (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: config.MINE_PAGE,
                  })
                } 
              }
            })
          }
        })
      }
    })
  }, 
  
  error(e) {
    console.log(e.detail)
  }
})