Component({
  properties: {
    navTitle: {
      type: String,
      value: "标题"
    },
    leftIcon: String, 
  },
  methods: {
    onHamburgerClick() {
      // 跳转到目标页面
      wx.navigateTo({
        url: '/page/mine/mine',
      });
    },
  },
});
