//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        PageCur: "home",
        homeColor: "cyan",
        informationColor: "gray",
        profileColor: "gray",

    },
    onLoad:function(){
        // var userInfo=wx.getStorageSync('userInfo');
        // console.log("缓存中获取用户",userInfo)
        wx.cloud.callFunction({
            name: "getOpenid",
            data: {}
          }).then(res => {
            console.log("获取Opentid成功", res)
           
             app.globalData.userOpenid=res.result.openid
            
          }).catch(res => {
            console.log("获取Opentid失败", res)
          })
    },
    NavChange(e) {
        console.log("获取信息试试",app.globalData.userInfo)
        let that = this
        console.log("点击了转换页面", e)
        switch (e.currentTarget.dataset.cur) {
            case "home":
                that.setData({
                    homeColor: "cyan",
                    informationColor: "gray",
                    profileColor: "gray"
                })
                break;

            case "information":
                that.setData({
                    homeColor: "gray",
                    informationColor: "cyan",
                    profileColor: "gray"
                })
                wx.redirectTo({
                    url: '/components/w-information/w-information',
                    success: (result)=>{
                        wx.showLoading({
                            title: "数据载入ing",
                            mask: true,
                            success: (result)=>{
                                
                            },
                            fail: ()=>{},
                            complete: ()=>{}
                        });
                        //console.log("我跳转")
                    },
                    fail: ()=>{},
                    complete: ()=>{}
                });
                break;

            case "profile":
                that.setData({
                    homeColor: "gray",
                    informationColor: "gray",
                    profileColor: "cyan"
                })
                break;

            default:
                break;
        }
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
    },
    onShareAppMessage:function(options){
        
    }
})