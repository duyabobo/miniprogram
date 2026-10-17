const config = require('../../config.js')
const navBar = require('../../util/nav_bar')

Component({
  properties: {
    title: {
      type: String,
      value: '',
    },
  },

  data: {
    statusBarHeight: 20,
    navContentHeight: 44,
    navBarHeight: 64,
  },

  lifetimes: {
    attached() {
      this.syncNavLayout()
    },
    ready() {
      this.syncNavLayout()
    },
  },

  pageLifetimes: {
    show() {
      this.syncNavLayout()
    },
  },

  methods: {
    syncNavLayout() {
      this.setData(navBar.getNavBarLayout())
    },

    onBack() {
      navBar.goBackHome(config.GUANGUAN_PAGE)
    },
  },
})
