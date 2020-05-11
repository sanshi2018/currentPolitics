//index.js
//获取应用实例
const app = getApp()
import {
  getNews
} from '../../service/home.js'
Component({
  data: {
    //tabbar
    cityNews:[],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgList: [],
    swiperCurren: 0,
    userInfoImage: ""
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
      
      //获取轮播图数据
      wx.cloud.callFunction({
        name: "linkDB",
        data:{
          action:"getSwitchPic"
        }
      }).then(res => {
        console.log("获取轮播图成功", res)
        this.setData({
          imgList: res.result.data[0].SwitchPic
        })
      }).catch(res => {
        console.log("获取轮播图失败", res)
      })
      // 获取新闻数据
      getNews("申请数据的KEY, "类别")
        .then(res => {
          console.log("获取数据成功", res)
          this.setData({
            showitem: true,
            cityNews: res.result.data
          })
        })
        .catch(res => {
          console.log("获取数据失败", res)
          wx.cloud.callFunction({
            name:"linkDB",
            data:{
              action:"getNews"
            }
          }).then(res=>{
            //console.log("从数据库那固定数据",res)
            that.setData({
              showitem: true,
              cityNews: res.result.data[0].result.data
            })
          }).catch(res=>{console.log("数据库也没拿到",res)})
        })

    }, // 组件挂载后执行
    detached: function () { }, // 组件移除执行
    moved: function () { }, // 组件移动的时候执行
  },
  methods: {

    //登录
    getUserInfo(e) {
      console.log(e)
      wx.setStorage({
        key: "userInfo",
        data: e.detail.userInfo
      })
      this.setData({
        userInfo: e.detail.userInfo,
        userInfoImage: e.detail.userInfo.avatarUrl,
        hasUserInfo: true
      })
    },
    /**
     * 生命周期函数--监听页面显示
     */

    //轮播图片改变时触发
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },





  }
})