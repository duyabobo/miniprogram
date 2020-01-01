// page/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background_img: '/resources/1.jpg',
    head_image: '/resources/daytime.png',
    nickname: 'nickname',
    user_id: 30,
    sex: '女',
    age: '28岁',
    degree: '本科',
    height: '165cm',
    verify_icon_list: ['/resources/kind/canvas.png', '/resources/kind/content.png', '/resources/kind/daytime.png'],
    could_op: 1,
    user_info_type: '择偶条件',
    user_info_detail_list: [
      '测试1', '测试2', '测试测试3', '测试测试4cesshi‘', '测试测试测试'
    ],
    user_expect_info_list: [
      {
        key: '啥子',
        value: 30,
      },
      {
        key: '点赞',
        value: 300000000,
      },
      {
        key: '哈哈',
        value: 0,
      },
      {
        key: '一下',
        value: 30,
      },
      {
        key: '测试',
        value: 30,
      },
      {
        key: '一下',
        value: 30,
      },
      {
        key: '测试',
        value: 30,
      },
      {
        key: '测试',
        value: 30,
      },
      {
        key: '哈下',
        value: 30,
      },
      {
        key: '测试',
        value: 30,
      },
      {
        key: '测试',
        value: 30,
      },
      {
        key: '哈下',
        value: 30,
      },
      {
        key: '测试',
        value: 30,
      },
      {
        key: '测试',
        value: 30,
      },
      {
        key: '哈下',
        value: 30,
      },
      {
        key: '测试',
        value: 30,
      },
      {
        key: '哈下',
        value: 30,
      }
    ],
     
  },

  invite_op: function (event) {
    console.log('todo: 这里是发邀请请求的')
  },

  overtures_op: function (event) {
    console.log('todo: 这里是发示好请求的')
  },

  ignore_op: function (event) {
    console.log('todo: 这里是发忽略请求的')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var user_id = options.to_user_id
    var could_op = options.could_op 
    if (could_op == undefined) {
      could_op = 0
    }
    this.setData({
      user_id: user_id,
      could_op: could_op,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})