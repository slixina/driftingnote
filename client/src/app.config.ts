export default {
  pages: [
    'pages/index/index',
    'pages/drifting/index',
    'pages/my/index',
    'pages/login/index',
    'pages/driftingCreate/index',
    'pages/driftingDetails/index',
    'pages/driftingInvitation/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#666",
    selectedColor: "#b4282d",
    backgroundColor: "#fafafa",
    borderStyle: 'black',
    list: [{
      pagePath: "pages/index/index",
      iconPath: "./assets/tab-icon/index-off.png",
      selectedIconPath: "./assets/tab-icon/index-on.png",
      text: "首页"
    }, {
      pagePath: "pages/my/index",
      iconPath: "./assets/tab-icon/my-off.png",
      selectedIconPath: "./assets/tab-icon/my-on.png",
      text: "我的"
    }]
  },
  cloud: true
}
