// page/my_requirement/my_requirement.js
var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requirement_list: [
      {
        id: 1,
        op_type: "ceshi",
        desc: "周末有时间", 
        value: "是的",
        item_list: ["是的", "没有"],
      }
    ]
  },

  upsert_requirement: function(event) {
    const that = this;
    const id = event.currentTarget.dataset.id;
    const op_type = event.currentTarget.dataset.op_type;
    const item_list = event.currentTarget.dataset.item_list;
    wx.showActionSheet({
      itemList: item_list,
      success (res) {
        console.log(res.tapIndex)
        wx.request({
          url: config.HTTP_HOST_TEST + config.upsert_requirement_url,
          data: {
            id: id,
            op_type: op_type,
            value: res.tapIndex
          },
          success(res) {
            if (res.data.code === 0) {
              that.setData(res.data)  // 有性能问题
            } else {
                const errmsg = res.data.errmsg;
                console.log(errmsg)
                if (errmsg !== undefined) {
                  wx.showToast({
                    title: errmsg,
                    icon: 'loading',
                    duration: 800,
                    mask: true
                  })
                }
            }
          },
          fail(res) {
            console.log('upsert_requirement fail')
          }
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const app = getApp();
    const request_data = {
      access_token: app.globalData.access_token,
    };
    wx.request({
      url: config.HTTP_HOST_TEST + config.requirement_url,
      data: request_data,
      success(res) {
        if (res.data.code === 0) {
          that.setData(res.data)
        }
      },
      fail(res) {
        console.log('myself err')
        console.log(res)
      }
    })
  },
})