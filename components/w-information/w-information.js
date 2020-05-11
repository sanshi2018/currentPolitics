const app = getApp()
let ID = []
const TOP_DISTANCE = 700
Component({
  data: {
    ISsectionContent: false,
    showInfo: false,
    sectionImage: "cloud://sanshi-oyomo.7361-sanshi-oyomo-1301133430/currentPolitics/m/1.png",
    previewImage: ["cloud://sanshi-oyomo.7361-sanshi-oyomo-1301133430/currentPolitics/m/1.png"],
    sectionContent: [],
    userOpenid: "",
    icon_favor: "cloud://sanshi-oyomo.7361-sanshi-oyomo-1301133430/currentPolitics/icon/nuLike.png",
    favor_userId: [],
    modalName: null,
    //-------------列表框--------------
    sectionName: [],//章节名
    index: "0",//具体章节的索引
    inputContent: "",
    showBackTop: false,

    UserDbID: "",//用户_id
    Browse: [],//用户浏览记录
    UserFavor: []//用户的喜欢
  },
  properties: {},
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created: function () {
    }, // 组件在内存中创建完毕执行
    attached: function () {
    }, // 组件挂载之前执行
    ready: function () {
      wx.showLoading({
        title: '加载ing',
      })
      // this.getUserDbID()
      this.data.userOpenid = app.globalData.userOpenid
      this.getSectinID()
      this.getSectionName()
      if (wx.getStorageSync('sectionPageAll').length <= 0) {
        this.getSectionPage()
      }
      this.getUserBrowseByid()
      this.getUserFavorByid()
      this.getSectionByStorage()
      this.getSectionContent()




    }
  },
  methods: {
    /**
     * 点击列表的某个框框 执行刷新页面
     * 这里用index来标记要展现那个页面
     * @param {事件} e 
     */
    openSection(e) {
      let that = this
      wx.showLoading({
        title: "加载中",
        mask: true,
      });
      // console.log("点击列表", e)
      this.setData({
        index: e.currentTarget.dataset.index,
        modalName: null
      })
      //console.log("当前模板ID=", ID)
      this.getSectionByStorage()//主图片
      this.getSectionContent()//评论+收藏图标
      //添加浏览记录写入章节名称和时间
      this.userInfoAddBrowse()
      this.setData({
        showInfo: true
      })
    },
    /**
     * 用来获取输入框内容
     * @param {*} event 
     */
    criticBox(event) {
      this.data.inputContent = event.detail.value
    },
    sendCritic(event) {
      if (wx.getStorageSync("userInfo").nickName == null) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          image: '',
          duration: 700,
          mask: false,
        });
        return
      } else {
        if (this.data.inputContent.length < 1) {
          wx.showToast({
            title: '字数太少了',
            icon: 'none',
            image: '',
            duration: 700,
            mask: false,
          });
          return
        } else {
          wx.showLoading({
            title: "发布ing",
            mask: true,
          });
          let that = this
          let i_ndex = that.data.index
          let id = ID[i_ndex]._id
          //从缓存中获取用户的名字和头像
          //用户头像上传的数据库
          var userInfo = wx.getStorageSync('userInfo');
          let userIcon = userInfo.avatarUrl
          let userName = userInfo.nickName
          let userContent = that.data.inputContent


          let sectionContent = that.data.sectionContent
          let contnetOjb = {}
          contnetOjb.userIcon = userIcon
          contnetOjb.userName = userName
          contnetOjb.userData = that.getNowFormatDate()
          contnetOjb.userContent = userContent
          //点赞暂时搁置--！
          //contnetOjb.LikeSum = 
          // contnetOjb.LikeId = 
          sectionContent.push(contnetOjb)
          // console.log("当前数组",sectionContent)
          wx.cloud.callFunction({
            name: "linkDB",
            data: {
              action: "sendCritic",
              id: id,
              content: sectionContent
            }
          }).then(res => {
            that.setData({
              inputContent: ''
            })
            // 评论成功后刷新页面
            that.getSectionContent()
            wx.createSelectorQuery().select('#C1').boundingClientRect(function (rect) {
              //使页面滚动到底部
              wx.pageScrollTo({
                scrollTop: rect.height
              })
            }).exec()
          }).catch(res => { })
        }


      }

    },
    /**
     * 点击图片可以放大预览
     * @param {*} e 
     */
    previewImage(e) {
      let that = this
      wx.previewImage({
        current: "cloud://sanshi-oyomo.7361-sanshi-oyomo-1301133430/Snipaste_2020-05-05_23-30-24.png", // 当前显示图片的http链接
        urls: that.data.previewImage // 需要预览的图片http链接列表
      })
    },
    /**
     * 抽屉特效控制开关
     * @param {*} e 
     */
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    addFavor() {
      let that = this
      let i_ndex = that.data.index
      let id = ID[i_ndex]._id
      if (wx.getStorageSync("userInfo").nickName == null) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          image: '',
          duration: 700,
          mask: false,
        });
        return
      }else{
      // 防止重复添加
      if (that.data.favor_userId.length != 0) {
        that.data.favor_userId.forEach(function (value, index) {
          if (app.globalData.userOpenid == value._id) {
            wx.showModal({
              title: '',
              content: '是否取消收藏',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '确定',
              confirmColor: '#3CC51F',
              success: (result) => {
                if (result.confirm) {
                  //取消收藏
                  that.data.favor_userId.splice(index, 1)
                  that.setData({
                    favor_userId: that.data.favor_userId
                  })
                  console.log("取消收藏")
                  wx.showToast({
                    title: '取消收藏',
                    icon: 'none',
                    image: '',
                    duration: 500,
                    mask: false,
                  });
                  // 同步到数据库
                  that.userInfoDelFavor()
                  let favor_userId = that.data.favor_userId
                  wx.cloud.callFunction({
                    name: "linkDB",
                    data: {
                      action: "addFavor",
                      id: id,
                      openid: favor_userId
                    }
                  })
                  // 更改同步到数据库

                  that.setData({
                    icon_favor: "cloud://sanshi-oyomo.7361-sanshi-oyomo-1301133430/currentPolitics/icon/nuLike.png"
                  })
                  return
                }
                if (result.cancel) {
                  return
                }
              },
              fail: () => { },
              complete: () => { }
            });

          } else {
            that.addNewFavor()
          }
        })
      } else {
        that.addNewFavor()
      }

      }

    },
    /**
     * 调用云函数获取所需要的数据
     * @param {*} e 
     */

    /**
     * 这里是获取章节的名字
     */
    getSectionName(e) {
      wx.cloud.callFunction({
        name: "linkDB",
        data: {
          action: "getSectionName"
        }
      }).then(res => {
        this.setData({
          sectionName: res.result.data[0].Section
        })
      })
        .catch(res => { console.log("章节名获取失败", res) })
    },
    /**
 * 获取(图片) 避免性能浪费这里只获取一次就够了
 * 图片存放在缓存中
 */
    getSectionPage(e) {
      wx.cloud.callFunction({
        name: "linkDB",
        data: {
          action: "getSectionPage"
        }
      }).then(res => {
        //  console.log("本章数据Page图片缓存获取成功", res)
        //考虑到数据过多这里直接把所有章节的信息(不包含评论)
        wx.setStorage({
          key: "sectionPageAll",
          data: res.result.data
        })

      }).catch(res => {
        console.log("本章数据获取失败", res)
      })
    },
    // 考虑到评论可能要频繁刷新这里就单独分离出来
    /**
 * 评论数据
 */
    getSectionContent() {

      let index = this.data.index
      wx.cloud.callFunction({
        name: "linkDB",
        data: {
          action: "getSectionContent"
        }
      }).then(res => {
        //console.log("本章评论页面", res.result.data[index])
        this.setData({
          favor_userId: res.result.data[index].favor_userId,
          sectionContent: res.result.data[index].userContent
        })
        console.log("评论成功后刷下", res)
        this.compare()
        wx.hideLoading();

      })
        .catch(res => { console.log("评论获取失败", res) })
    },

    /**
     * 对比数据库表中的收藏列表中是否包含当前用户的Openid
     */
    compare() {
      var openid = app.globalData.userOpenid
      var that = this
      //console.log("收藏长度=", this.data.favor_userId.length)
      // console.log("收藏ID=", app.globalData.userOpenid)
      if (this.data.favor_userId.length != 0) {
        this.data.favor_userId.forEach(function (value, index) {
          //  console.log("有收藏数据正在遍历openid=", openid, "value=", value)
          if (openid == value._id) {
            // console.log("查找收藏成功")
            that.setData({
              icon_favor: "cloud://sanshi-oyomo.7361-sanshi-oyomo-1301133430/currentPolitics/icon/uLike.png"
            })

          }

        })
      }
      else {
        //console.log("如果没有收藏应该改这个呀")
        that.setData({
          icon_favor: "cloud://sanshi-oyomo.7361-sanshi-oyomo-1301133430/currentPolitics/icon/nuLike.png"
        })
      }


    },
    /**
     * 页面数据从缓存中获取(图片)
     */
    getSectionByStorage() {
      let index = this.data.index
      var that = this
      var sectionPageAll = wx.getStorageSync('sectionPageAll');
      if (sectionPageAll.length > 0) {
        //console.log("这里是缓存不为空", sectionPageAll[index].SectionImage)
        that.setData({
          sectionImage: sectionPageAll[index].SectionImage,
          previewImage: [sectionPageAll[index].SectionImage]
        })
      }
    },
    /**
 * 这里直接从数据库里拿出所有ID集合
 * 因为后期更新数据需要依据ID进行操作
 */
    getSectinID() {
      wx.cloud.callFunction({
        name: "linkDB",
        data: {
          action: "getSectionID"
        }

      }).then(res => {
        ID = res.result.data

      }).catch(res => {
        console.log("ID获取失败", res)
      })
    },
    addNewFavor() {
      let that = this
      let i_ndex = that.data.index
      let id = ID[i_ndex]._id
      wx.showToast({
        title: '收藏成功',
        icon: 'none',
        image: '',
        duration: 500,
        mask: false,
      });
      //这里是往页面表里的收藏里面添加用户ID
      let favor_userId = that.data.favor_userId
      let openidOjb = {}
      openidOjb._id = app.globalData.userOpenid
      favor_userId.push(openidOjb)
      // console.log("当前ID=", id, "当前对象=", favor_userId)
      wx.cloud.callFunction({
        name: "linkDB",
        data: {
          action: "addFavor",
          id: id,
          openid: favor_userId
        }
      }).then(res => { }).catch(res => { })
      // 这个是往用户个人表里添加收藏
      that.userInfoAddFavor()
      that.setData({
        icon_favor: "cloud://sanshi-oyomo.7361-sanshi-oyomo-1301133430/currentPolitics/icon/uLike.png"
      })
    },
    /**
     * 获取当前时间，返回时间格式 ：2020-5-2 15：43：36
     */
    getNowFormatDate: function () {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
      return currentdate;
    }
    ,
    onPageScroll(options) {
      //  console.log(options)
      //取出距离顶部的距离
      const scrollTop = options.scrollTop;
      //   2.修改showBackTop属性
      // 官方：不要在滚动的函数会叫中频繁的调用whis.setData
      // if(scrollTop >= TOP_DISTANCE){
      //     this.setData({
      //         showBackTop: true
      //     })
      // }else{
      //     this.setData({
      //         showBackTop: false
      //     })
      // }
      if (scrollTop >= TOP_DISTANCE != this.data.showBackTop) {
        this.setData({
          showBackTop: scrollTop >= TOP_DISTANCE
        })
      }

    },
    // getUserDbID() {
    //   let openid = app.globalData.userOpenid
    //   wx.cloud.callFunction({
    //     name: "setUserInfo",
    //     data: {
    //       action: "getUserDbID",
    //       openid: openid
    //     }
    //   }).then(res => {
    //     console.log("获取UID成功",res)
    //     this.data.UserDbID = res.result.data[0]._id
    //   }).catch(res => { console.log("获取UID失败", res) })

    // },
    getUserBrowseByid() {
      //  this.getUserDbID()
      let userDbID = app.globalData.userOpenid
      wx.cloud.callFunction({
        name: "setUserInfo",
        data: {
          action: "getUserBrowseByid",
          id: userDbID
        }
      }).then(res => {
        //console.log("浏览数据获取成功", res)
        this.data.Browse = res.result.data.browse
      }).catch(res => { console.log("浏览数据获取失败", res) })

    },
    getUserFavorByid() {
      // this.getUserDbID()
      let userDbID = app.globalData.userOpenid
      wx.cloud.callFunction({
        name: "setUserInfo",
        data: {
          action: "getUserBrowseByid",
          id: userDbID
        }
      }).then(res => {
        //console.log("浏览数据获取成功", res)
        this.data.UserFavor = res.result.data.favor
      }).catch(res => { console.log("浏览数据获取失败", res) })
    },
    userInfoAddBrowse() {
      this.getUserFavorByid()
      let that = this
      let index = that.data.index
      let userDbID = app.globalData.userOpenid
      let userBrowsName = that.data.sectionName[index].Name
      let data = that.getNowFormatDate()
      let Browse = that.data.Browse
      let browsObj = {}
      browsObj.sectionName = userBrowsName
      browsObj.time = data
      Browse.push(browsObj)
      wx.cloud.callFunction({
        name: "setUserInfo",
        data: {
          action: "userInfoAddBrowse",
          id: userDbID,
          browse: Browse
        }
      }).then(res => {
        //   console.log("浏览数据添加成功", res)
        that.data.Browse = Browse
      }).catch(res => { console.log("浏览数据添加失败", res) })
    }
    ,
    userInfoAddFavor() {
      this.getUserFavorByid()
      let that = this
      let index = that.data.index
      let userDbID = app.globalData.userOpenid
      let userBrowsName = that.data.sectionName[index].Name
      let UserFavor = that.data.UserFavor
      let favorObj = {}
      favorObj.sectionName = userBrowsName
      UserFavor.push(favorObj)
      wx.cloud.callFunction({
        name: "setUserInfo",
        data: {
          action: "userInfoAddFavor",
          id: userDbID,
          favor: UserFavor
        }
      }).then(res => {
        that.data.UserFavor = UserFavor
        console.log("收藏添加成功", res)
      }).catch(res => { console.log("收藏添加失败", res) })
    },
    userInfoDelFavor() {
      let that = this
      let index = that.data.index
      let userBrowsName = that.data.sectionName[index].Name
      let userFavor = that.data.UserFavor
      let userDbID = app.globalData.userOpenid
      //  console.log("进入取消个人表的收藏更改前",userFavor)
      userFavor.forEach(function (value, index) {
        if (value.sectionName == userBrowsName) {
          that.data.UserFavor.splice(index, 1)
          that.setData({
            UserFavor: that.data.UserFavor
          })
          //  console.log("进入取消个人表的收藏更改后",that.data.UserFavor)
          // 更改同步到数据库
          wx.cloud.callFunction({
            name: "setUserInfo",
            data: {
              action: "userInfoDelFavor",
              id: userDbID,
              favor: that.data.UserFavor
            }
          }).then(res => {
            // console.log("取消收藏成功", res)
            return
          }).catch(res => { console.log("取消收藏失败", res) })

          return
        }
      })
    },
    onShareAppMessage:function(options){
          
    }
  }
})