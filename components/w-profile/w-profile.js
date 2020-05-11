const app = getApp()
Component({
  data: {
    index: 0,
    Browse:[],
    Favor:[],
    UserDbID:""
  },
  properties: {},
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created: function () { }, // 组件在内存中创建完毕执行
    attached: function () {
    }, // 组件挂载之前执行
    ready: function () {
      this.getUserBrowse()
      this.getUserFavor()
    }, // 组件挂载后执行
    detached: function () { }, // 组件移除执行
    moved: function () { }, // 组件移动的时候执行
  },
  methods: {
    onItemClick(e) {
      console.log(e)
      this.setData({
        index: e.detail.index
      })
    },

    getUserBrowse(){
      let openid =  app.globalData.userOpenid
      console.log("用于列表的Openid=",openid)
      wx.cloud.callFunction({
        name:"getUserInfo",
        data:{
          action:"getUserBrowse",
          openid:openid
        }
      }).then(res=>{
        console.log("获取浏览列表成功",res)
        this.setData({
          Browse:res.result.data[0].browse
        })
        console.log("Browse列表=",this.data.Browse)
      }).catch(res=>{console.log("获取浏览列表失败",res)})
    },
    getUserFavor(){
      let openid =  app.globalData.userOpenid
      console.log("用于列表的Openid=",openid)
      wx.cloud.callFunction({
        name:"getUserInfo",
        data:{
          action:"getUserFavor",
          openid:openid
        }
      }).then(res=>{
        console.log("获取喜欢列表成功",res)
        this.setData({
          Favor:res.result.data[0].favor
        })
        console.log("Browse列表=",this.data.Browse)
      }).catch(res=>{console.log("获取喜欢列表失败",res)})
    }
  }
})