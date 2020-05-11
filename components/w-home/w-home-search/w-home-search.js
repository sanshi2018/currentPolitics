const app = getApp()
Component({
  data: {
    userInfoImage: "",
    sign: false
  },
  properties: {},
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created: function () { }, // 组件在内存中创建完毕执行
    attached: function () {
    }, // 组件挂载之前执行
    ready: function () {
      var that = this
      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo.avatarUrl != null) {
        console.log("这里是缓存不为空", userInfo)
        that.setData({
          userInfoImage: userInfo.avatarUrl
        })
      } else {
        console.log("这里是缓存为空", userInfo)
        that.setData({
          userInfoImage: "https://image.weilanwl.com/img/square-1.jpg"
        })
      }

    }, // 组件挂载后执行
    detached: function () { }, // 组件移除执行
    moved: function () { }, // 组件移动的时候执行
  },
  methods: {//登录
    getUserInfo(e) {
     
      console.log(e)
      wx.setStorage({
        key: "userInfo",
        data: e.detail.userInfo
      })
      this.setData({
        userInfoImage: e.detail.userInfo.avatarUrl
      })
      this.addUserInfo()
    },
    addUserInfo() {
      wx.cloud.callFunction({
        name: "setUserInfo",
        data: {
          action: "addUserInfo",
          openid: app.globalData.userOpenid
        }
      })
    }
  }
})