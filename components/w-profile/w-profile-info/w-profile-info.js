const app = getApp()
Component({
  data: {
    userInfoImage: "",
    sex: "",
    nickName: "",
    sexIcon: true
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
          userInfoImage: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          sex: userInfo.gender,
          sexIcon: false

        })
      } else {
        console.log("这里是缓存为空", userInfo)
        that.setData({
          userInfoImage: "https://image.weilanwl.com/img/square-1.jpg",
          nickName: " ",
          sex: " ",
          sexIcon: true

        })
      }

    }, // 组件挂载后执行
    detached: function () { }, // 组件移除执行
    moved: function () { }, // 组件移动的时候执行
  },
  methods: {
    getUserInfo(e) {
      console.log(e)
      wx.setStorage({
        key: "userInfo",
        data: e.detail.userInfo
      })
      this.setData({
        userInfoImage:  e.detail.userInfo.avatarUrl,
        sex: e.detail.userInfo.gender,
        nickName:e.detail.userInfo.nickName,
        sexIcon: false
      })
      this.addUserInfo()
    },
    naviAbout:function(){
      console.log("点击跳转")
      wx.navigateTo({
        url: '/pages/about/about',
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
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
})