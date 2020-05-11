Component({
  data: {
    TabCur:0
  },
  properties: {
  },
  methods: {
    tabSelect(e) {
      var index=e.currentTarget.dataset.id
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id-1)*60
      })
       //发出自定义事 通知页面内部地点击事件
       //组件向上层组件 传递参数
       this.triggerEvent('itemclick',{index},{})
    }
  }
})