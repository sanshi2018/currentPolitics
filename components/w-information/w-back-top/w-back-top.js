Component({
  data: {},
  properties: {},
  methods: {
    handleBackTop(){
      //console.log("页面回到顶部")
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  }
})