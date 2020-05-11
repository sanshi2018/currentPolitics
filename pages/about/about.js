const app = getApp();
Page({
    toggle(e) {
        wx.showModal({
            title: '确定清除缓存',
            content: '',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {
                    console.log(e);
                    var anmiaton = e.currentTarget.dataset.class;
                    var that = this;
                    that.setData({
                        animation: anmiaton
                    })
                    setTimeout(function () {
                        that.setData({
                            animation: ''
                        })
                    }, 1000)
                    wx.removeStorage({
                        key: 'userInfo',
                        success(res) {
                            console.log(res)
                        }
                    }), wx.removeStorage({
                        key: 'sectionPageAll',
                        success(res) {
                            console.log(res)
                        }
                    })
                }
            },
            fail: () => { },
            complete: () => { }
        });


    }
})